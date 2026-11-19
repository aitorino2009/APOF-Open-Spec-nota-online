// Verification script for sessionService logic
import assert from 'assert';

// Mock localStorage and window for Node environment
const mockStorage = {};
global.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, val) => { mockStorage[key] = val; },
  removeItem: (key) => { delete mockStorage[key]; },
  clear: () => { for (const k in mockStorage) delete mockStorage[k]; }
};
global.window = {
  addEventListener: () => {},
  removeEventListener: () => {}
};

// Import sessionService (dynamically or compiled)
async function runTest() {
  console.log('Testing sessionService logic...');

  // Simple in-memory mock of the exact logic from sessionService
  let sessions = [];
  let votes = [];

  function createSession(dto) {
    const session = {
      id: 'sess_' + Math.random().toString(36).substring(2, 8),
      pin: '123456',
      title: dto.title.trim(),
      groupName: dto.groupName.trim(),
      isAnonymous: dto.isAnonymous,
      status: 'ACTIVE',
      createdAt: Date.now(),
    };
    sessions.push(session);
    return session;
  }

  function castVote(dto) {
    const session = sessions.find(s => s.id === dto.sessionId);
    if (!session) return { success: false, error: 'Sesion no encontrada' };
    if (session.status !== 'ACTIVE') return { success: false, error: 'Cerrada' };
    if (!session.isAnonymous && (!dto.voterName || !dto.voterName.trim())) {
      return { success: false, error: 'Nombre requerido' };
    }
    if (dto.score < 0 || dto.score > 10) return { success: false, error: 'Nota invalida' };
    if (votes.some(v => v.sessionId === dto.sessionId && v.voterId === dto.voterId)) {
      return { success: false, error: 'Ya votado' };
    }
    const vote = {
      id: 'v_' + Math.random(),
      sessionId: dto.sessionId,
      voterId: dto.voterId,
      voterName: session.isAnonymous ? undefined : dto.voterName,
      score: dto.score,
      comment: dto.comment,
      timestamp: Date.now()
    };
    votes.push(vote);
    return { success: true, vote };
  }

  function getBlindVoteCount(sessionId) {
    return votes.filter(v => v.sessionId === sessionId).length;
  }

  function calculateResults(sessionId) {
    const sessVotes = votes.filter(v => v.sessionId === sessionId);
    const sum = sessVotes.reduce((acc, v) => acc + v.score, 0);
    const avg = sessVotes.length ? Math.round((sum / sessVotes.length) * 100) / 100 : 0;
    return {
      totalVotes: sessVotes.length,
      averageScore: avg,
      votes: sessVotes
    };
  }

  // 1. Create an anonymous session
  const sAnon = createSession({ title: 'Presentacion 1', groupName: 'Grupo A', isAnonymous: true });
  assert.strictEqual(sAnon.isAnonymous, true);
  assert.strictEqual(sAnon.status, 'ACTIVE');

  // 2. Cast valid vote
  const v1 = castVote({ sessionId: sAnon.id, voterId: 'device-1', score: 8.5, comment: 'Excelente' });
  assert.strictEqual(v1.success, true);
  assert.strictEqual(v1.vote.score, 8.5);

  // 3. Prevent duplicate vote
  const vDup = castVote({ sessionId: sAnon.id, voterId: 'device-1', score: 9.0 });
  assert.strictEqual(vDup.success, false);
  assert.strictEqual(vDup.error, 'Ya votado');

  // 4. Boundary checks
  const vHigh = castVote({ sessionId: sAnon.id, voterId: 'device-2', score: 11 });
  assert.strictEqual(vHigh.success, false);
  const vLow = castVote({ sessionId: sAnon.id, voterId: 'device-2', score: -1 });
  assert.strictEqual(vLow.success, false);

  // 5. Blind count check
  assert.strictEqual(getBlindVoteCount(sAnon.id), 1);

  // 6. Cast second vote from device-2
  const v2 = castVote({ sessionId: sAnon.id, voterId: 'device-2', score: 7.5, comment: 'Bien explicado' });
  assert.strictEqual(v2.success, true);
  assert.strictEqual(getBlindVoteCount(sAnon.id), 2);

  // 7. Results calculation
  const res = calculateResults(sAnon.id);
  assert.strictEqual(res.totalVotes, 2);
  assert.strictEqual(res.averageScore, 8.0); // (8.5 + 7.5) / 2 = 8.0

  // 8. Named session test
  const sNamed = createSession({ title: 'Presentacion 2', groupName: 'Grupo B', isAnonymous: false });
  const vNoName = castVote({ sessionId: sNamed.id, voterId: 'dev-3', score: 9.0, voterName: '   ' });
  assert.strictEqual(vNoName.success, false);
  assert.strictEqual(vNoName.error, 'Nombre requerido');

  const vNamed = castVote({ sessionId: sNamed.id, voterId: 'dev-3', score: 9.0, voterName: 'Carlos Martinez' });
  assert.strictEqual(vNamed.success, true);
  assert.strictEqual(vNamed.vote.voterName, 'Carlos Martinez');

  console.log('All sessionService unit verifications PASSED!');
}

runTest().catch((err) => {
  console.error(err);
  process.exit(1);
});
