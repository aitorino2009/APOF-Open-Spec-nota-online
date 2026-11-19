export type SessionStatus = 'ACTIVE' | 'CLOSED';

export interface Session {
  id: string;
  pin: string;
  title: string;
  groupName: string;
  isAnonymous: boolean;
  status: SessionStatus;
  createdAt: number;
}

export interface Vote {
  id: string;
  sessionId: string;
  voterId: string;
  voterName?: string;
  score: number;
  comment?: string;
  timestamp: number;
}

export interface ScoreBucket {
  score: number;
  count: number;
}

export interface FeedbackComment {
  id: string;
  text: string;
  author?: string;
  score: number;
  timestamp: number;
}

export interface SessionResults {
  sessionId: string;
  totalVotes: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  distribution: ScoreBucket[];
  comments: FeedbackComment[];
  votes: Vote[];
}

export interface CreateSessionDTO {
  title: string;
  groupName: string;
  isAnonymous: boolean;
}

export interface CastVoteDTO {
  sessionId: string;
  voterId: string;
  voterName?: string;
  score: number;
  comment?: string;
}
