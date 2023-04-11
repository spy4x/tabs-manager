import { WebSocketServer } from 'ws';
import { z } from 'zod';
import type { Context } from './types';
import { authRouter, linkRouter, tagRouter } from './routes';
import { wsWrapper } from './helpers';

export function wssCreate() {
  const port = 8080;
  const wss = new WebSocketServer({ port });
  wss.on('listening', () => {
    console.log('WebSocketServer listening on port ' + port);
  });
  wss.on('connection', (ws) => {
    const context: Context = {
      userId: '',
      sessionId: '',
    };
    ws.on('message', async (messageRaw) =>
      wsWrapper('message', ws, async () => {
        console.log('received: %s', messageRaw);
        const message = JSON.parse(messageRaw.toString());
        const type = z.string().parse(message.t);
        if (type.startsWith('auth/')) {
          void authRouter(ws, context, message.t, message.data);
        } else if (type.startsWith('link/')) {
          void linkRouter(ws, context, message.t, message.data);
        } else if (type.startsWith('tag/')) {
          void tagRouter(ws, context, message.t, message.data);
        }
      }),
    );
  });
  return wss;
}

export function wssPlugin() {
  return {
    name: 'wss',
    configureServer(server: any) {
      const wss = wssCreate();
      server.httpServer.on('close', () => {
        console.log('WebSocketServer closing');
        wss.close();
      });
    },
  };
}
