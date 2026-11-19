import {
  Session,
  Vote,
  SessionResults,
  CreateSessionDTO,
  CastVoteDTO,
  ScoreBucket,
  FeedbackComment,
} from '../types';

const STORAGE_KEY_SESSIONS = 'nota_online_sessions';
const STORAGE_KEY_VOTES = 'nota_online_votes';
const CHANNEL_NAME = 'nota_online_realtime';

class SessionService {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<(event: { type: string; sessionId: string; data?: any }) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel(CHANNEL_NAME);
      this.channel.onmessage = (msg) => {
        this.notifyListeners(msg.data);
      };
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === STORAGE_KEY_SESSIONS || event.key === STORAGE_KEY_VOTES) {
          this.notifyListeners({ type: 'STORAGE_CHANGE', sessionId: '*' });
        }
      });
    }
  }

  private notifyListeners(data: any) {
    this.listeners.forEach((listener) => {
      try {
        listener(data);
      } catch (err) {
        console.error('Error in listener', err);
      }
    });
  }

  private broadcast(event: { type: string; sessionId: string; data?: any }) {
    this.notifyListeners(event);
    if (this.channel) {
      this.channel.postMessage(event);
    }
  }

  public subscribe(listener: (event: { type: string; sessionId: string; data?: any }) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private getStoredSessions(): Session[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
    return raw ? JSON.parse(raw) : [];
  }

  private saveSessions(sessions: Session[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    }
  }

  private getStoredVotes(): Vote[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEY_VOTES);
    return raw ? JSON.parse(raw) : [];
  }

  private saveVotes(votes: Vote[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_VOTES, JSON.stringify(votes));
    }
  }

  public generatePin(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  public createSession(dto: CreateSessionDTO): Session {
    const sessions = this.getStoredSessions();
    const session: Session = {
      id: 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      pin: this.generatePin(),
      title: dto.title.trim(),
      groupName: dto.groupName.trim(),
      isAnonymous: dto.isAnonymous,
      status: 'ACTIVE',
      createdAt: Date.now(),
    };

    sessions.push(session);
    this.saveSessions(sessions);
    this.broadcast({ type: 'SESSION_CREATED', sessionId: session.id, data: session });
    return session;
  }

  public getAllSessions(): Session[] {
    return this.getStoredSessions().sort((a, b) => b.createdAt - a.createdAt);
  }

  public getSession(sessionId: string): Session | null {
    return this.getStoredSessions().find((s) => s.id === sessionId) || null;
  }

  public getSessionByPin(pin: string): Session | null {
    return this.getStoredSessions().find((s) => s.pin === pin) || null;
  }

  public closeSession(sessionId: string): Session | null {
    const sessions = this.getStoredSessions();
    const index = sessions.findIndex((s) => s.id === sessionId);
    if (index === -1) return null;

    sessions[index].status = 'CLOSED';
    this.saveSessions(sessions);
    this.broadcast({ type: 'SESSION_CLOSED', sessionId, data: sessions[index] });
    return sessions[index];
  }

  public hasVoted(sessionId: string, voterId: string): boolean {
    const votes = this.getStoredVotes();
    return votes.some((v) => v.sessionId === sessionId && v.voterId === voterId);
  }

  public getBlindVoteCount(sessionId: string): number {
    const votes = this.getStoredVotes();
    return votes.filter((v) => v.sessionId === sessionId).length;
  }

  public castVote(dto: CastVoteDTO): { success: boolean; error?: string; vote?: Vote } {
    const session = this.getSession(dto.sessionId);
    if (!session) {
      return { success: false, error: 'Sesión no encontrada.' };
    }

    if (session.status !== 'ACTIVE') {
      return { success: false, error: 'La votación para este trabajo está cerrada.' };
    }

    if (!session.isAnonymous && (!dto.voterName || !dto.voterName.trim())) {
      return { success: false, error: 'Debes indicar tu nombre para votar en este trabajo.' };
    }

    if (dto.score < 0 || dto.score > 10 || isNaN(dto.score)) {
      return { success: false, error: 'La nota debe estar entre 0 y 10.' };
    }

    if (this.hasVoted(dto.sessionId, dto.voterId)) {
      return { success: false, error: 'Ya has emitido tu voto para esta presentación.' };
    }

    const votes = this.getStoredVotes();
    const newVote: Vote = {
      id: 'vote_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      sessionId: dto.sessionId,
      voterId: dto.voterId,
      voterName: session.isAnonymous ? undefined : dto.voterName?.trim(),
      score: Math.round(dto.score * 10) / 10,
      comment: dto.comment?.trim() ? dto.comment.trim() : undefined,
      timestamp: Date.now(),
    };

    votes.push(newVote);
    this.saveVotes(votes);
    this.broadcast({
      type: 'VOTE_CAST',
      sessionId: dto.sessionId,
      data: { count: this.getBlindVoteCount(dto.sessionId) },
    });

    return { success: true, vote: newVote };
  }

  public calculateResults(sessionId: string): SessionResults | null {
    const session = this.getSession(sessionId);
    if (!session) return null;

    const sessionVotes = this.getStoredVotes().filter((v) => v.sessionId === sessionId);
    const totalVotes = sessionVotes.length;

    if (totalVotes === 0) {
      return {
        sessionId,
        totalVotes: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        distribution: Array.from({ length: 11 }, (_, i) => ({ score: i, count: 0 })),
        comments: [],
        votes: [],
      };
    }

    const sum = sessionVotes.reduce((acc, v) => acc + v.score, 0);
    const averageScore = Math.round((sum / totalVotes) * 100) / 100;

    let highestScore = sessionVotes[0].score;
    let lowestScore = sessionVotes[0].score;
    const bucketMap: { [key: number]: number } = {};
    for (let i = 0; i <= 10; i++) bucketMap[i] = 0;

    const comments: FeedbackComment[] = [];

    sessionVotes.forEach((v) => {
      if (v.score > highestScore) highestScore = v.score;
      if (v.score < lowestScore) lowestScore = v.score;

      const rounded = Math.round(v.score);
      if (bucketMap[rounded] !== undefined) {
        bucketMap[rounded]++;
      }

      if (v.comment) {
        comments.push({
          id: v.id,
          text: v.comment,
          author: v.voterName,
          score: v.score,
          timestamp: v.timestamp,
        });
      }
    });

    const distribution: ScoreBucket[] = Object.keys(bucketMap).map((k) => ({
      score: Number(k),
      count: bucketMap[Number(k)],
    }));

    return {
      sessionId,
      totalVotes,
      averageScore,
      highestScore,
      lowestScore,
      distribution,
      comments,
      votes: sessionVotes,
    };
  }

  public exportResultsToCSV(results: SessionResults, session: Session): string {
    const headers = ['ID Sesion', 'Titulo', 'Grupo', 'Nota Media', 'Total Votos'];
    const summaryRow = [
      `"${session.id}"`,
      `"${session.title.replace(/"/g, '""')}"`,
      `"${session.groupName.replace(/"/g, '""')}"`,
      results.averageScore.toFixed(2),
      results.totalVotes.toString(),
    ].join(',');

    const voteHeaders = ['Votante', 'Nota (0-10)', 'Comentario', 'Fecha/Hora'];
    const voteRows = results.votes.map((v) => {
      const author = session.isAnonymous ? 'Anonimo' : v.voterName || 'Anonimo';
      const comment = (v.comment || '').replace(/"/g, '""');
      const date = new Date(v.timestamp).toLocaleString();
      return [`"${author}"`, v.score.toFixed(1), `"${comment}"`, `"${date}"`].join(',');
    });

    return [
      headers.join(','),
      summaryRow,
      '',
      voteHeaders.join(','),
      ...voteRows,
    ].join('\r\n');
  }
}

export const sessionService = new SessionService();
