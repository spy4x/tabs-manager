import { WebSocketServer } from 'ws';
import { prisma } from './prisma';

export function wssCreate() {
  const port = 8080;
  const wss = new WebSocketServer({ port });
  wss.on('listening', () => {
    console.log('WebSocketServer listening on port ' + port);
  });
  wss.on('connection', (ws) => {
    ws.on('message', async (messageRaw) => {
      console.log('received: %s', messageRaw);
      const message = JSON.parse(messageRaw.toString());
      switch (message.t) {
        case 'link/list': {
          const links = await prisma.link.findMany();
          ws.send(JSON.stringify({ t: 'link/list', data: links }));
          break;
        }
        case 'link/add': {
          try {
            const link = await prisma.link.create({ data: message.data });
            await new Promise((resolve) => setTimeout(resolve, 2000));
            ws.send(JSON.stringify({ t: 'link/add/success', data: link }));
          } catch (error: unknown) {
            if (error instanceof Error) {
              ws.send(JSON.stringify({ t: 'link/add/error', data: error.message }));
            }
          }
          break;
        }
      }
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
