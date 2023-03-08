import { WebSocketServer } from 'ws';
import { auth } from './auth';
import { prisma } from './prisma';
import { ZodError } from 'zod';
import { AuthSchema } from '../shared/models';

export function wssCreate() {
  const port = 8080;
  const wss = new WebSocketServer({ port });
  wss.on('listening', () => {
    console.log('WebSocketServer listening on port ' + port);
  });
  wss.on('connection', (ws) => {
    let userId = '';
    let sessionId = '';
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
            ws.send(JSON.stringify({ t: 'link/add/success', data: link }));
          } catch (error: unknown) {
            if (error instanceof Error) {
              ws.send(JSON.stringify({ t: 'link/add/error', data: error.message }));
            }
          }
          break;
        }
        case 'auth/reSignIn': {
          try {
            const session = await auth.validateSession(message.data.sessionId);
            if (session.userId !== message.data.id) {
              throw new Error('Invalid session');
            }
            sessionId = session.sessionId;
            userId = session.userId;
            ws.send(JSON.stringify({ t: 'auth/signedIn', data: { id: userId, sessionId } }));
          } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
              ws.send(JSON.stringify({ t: 'auth/signIn/error', data: error.message }));
            }
          }
          break;
        }
        case 'auth/signIn': {
          try {
            const payload = AuthSchema.parse(message.data);
            const key = await auth.validateKeyPassword('email', payload.email, payload.password);
            userId = key.userId;
            const session = await auth.createSession(userId);
            sessionId = session.sessionId;
            ws.send(JSON.stringify({ t: 'auth/signedIn', data: { id: userId, sessionId } }));
          } catch (error: unknown) {
            if (error instanceof ZodError) {
              console.log(error);
              ws.send(JSON.stringify({ t: 'auth/signIn/error', data: error.format() }));
            } else {
              console.error(error);
              ws.send(JSON.stringify({ t: 'auth/signIn/error', data: 'Server error' }));
            }
          }
          break;
        }
        case 'auth/signUp': {
          try {
            const payload = AuthSchema.parse(message.data);
            const user = await auth.createUser({
              key: {
                providerId: 'email',
                providerUserId: payload.email,
                password: payload.password,
              },
              attributes: {},
            });
            userId = user.userId;
            const session = await auth.createSession(userId);
            sessionId = session.sessionId;
            ws.send(
              JSON.stringify({
                t: 'auth/signedUp',
                data: { id: userId, sessionId },
              }),
            );
          } catch (error: unknown) {
            if (error instanceof ZodError) {
              console.log(error);
              ws.send(JSON.stringify({ t: 'auth/signUp/error', data: error.format() }));
            } else {
              console.error(error);
              ws.send(JSON.stringify({ t: 'auth/signUp/error', data: 'Server error' }));
            }
          }
          break;
        }
        case 'auth/signOut': {
          try {
            await auth.invalidateSession(sessionId);
            userId = '';
            sessionId = '';
            ws.send(JSON.stringify({ t: 'auth/signedOut', data: {} }));
          } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
              ws.send(JSON.stringify({ t: 'auth/signOut/error', data: error.message }));
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
