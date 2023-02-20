import type { Link } from '@prisma/client';
import { WebSocketServer } from 'ws';
import { prisma } from './prisma';

export function wssCreate() {
  const port = 8080;
  const wss = new WebSocketServer({ port });
  wss.on('listening', () => {
    console.log('WebSocketServer listening on port ' + port);
  });
  wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
      console.log('received: %s', message);
      // convert message to string
      const data: Link = JSON.parse(message.toString());
      const link = await prisma.link.create({ data });
      ws.send('created: ' + JSON.stringify(link));
    });
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
