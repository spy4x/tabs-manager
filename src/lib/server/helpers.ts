import type { WebSocket } from 'ws';
import { ZodError } from 'zod';

export async function wsWrapper(
  type: string,
  ws: WebSocket,
  fn: () => Promise<void>,
): Promise<void> {
  try {
    await fn();
  } catch (error: unknown) {
    const errorType = `${type}/error`;
    if (error instanceof ZodError) {
      ws.send(JSON.stringify({ t: errorType, data: error.format() }));
    } else {
      console.error(error);
      ws.send(JSON.stringify({ t: errorType, data: 'Server error' }));
    }
  }
}

export function send(ws: WebSocket, data: any): void {
  ws.send(JSON.stringify(data));
}
