import { logInfo } from "./logger";

export interface SseSession {
  sessionId: string;
  send: (data: string) => void;
  close: () => void;
}

// Store active sessions on globalThis so hot reload in Next.js development doesn't wipe them
const globalForSessions = globalThis as unknown as {
  _mcpSseSessions?: Map<string, SseSession>;
};

function getSessionMap(): Map<string, SseSession> {
  if (!globalForSessions._mcpSseSessions) {
    globalForSessions._mcpSseSessions = new Map<string, SseSession>();
  }
  return globalForSessions._mcpSseSessions;
}

export function registerSession(session: SseSession) {
  const map = getSessionMap();
  map.set(session.sessionId, session);
  logInfo(`SSE session registered: ${session.sessionId} (active sessions: ${map.size})`);
}

export function unregisterSession(sessionId: string) {
  const map = getSessionMap();
  map.delete(sessionId);
  logInfo(`SSE session closed: ${sessionId} (active sessions: ${map.size})`);
}

export function getSession(sessionId: string): SseSession | undefined {
  return getSessionMap().get(sessionId);
}
