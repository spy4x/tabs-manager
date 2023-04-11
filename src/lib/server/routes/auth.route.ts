import { AuthSchema } from '../../shared/models';
import type { WebSocket } from 'ws';
import { auth } from '../auth';
import type { Context } from '../types';
import { send, wsWrapper } from '../helpers';

export async function authRouter(
  ws: WebSocket,
  context: Context,
  type: string,
  data: any,
): Promise<void> {
  switch (type) {
    case 'auth/reSignIn': {
      return wsWrapper('auth/reSignIn', ws, async () => {
        const session = await auth.validateSession(data.sessionId);
        if (session.userId !== data.id) {
          return send(ws, {
            t: 'auth/reSignIn/error',
            data: 'Invalid session',
          });
        }
        context.sessionId = session.sessionId;
        context.userId = session.userId;
        send(ws, {
          t: 'auth/signedIn',
          data: { id: context.userId, sessionId: context.sessionId },
        });
      });
    }
    case 'auth/signIn': {
      return wsWrapper('auth/signIn', ws, async () => {
        const payload = AuthSchema.parse(data);
        const key = await auth.useKey('email', payload.email, payload.password);
        context.userId = key.userId;
        const session = await auth.createSession(context.userId);
        context.sessionId = session.sessionId;
        send(ws, {
          t: 'auth/signedIn',
          data: { id: context.userId, sessionId: context.sessionId },
        });
      });
    }
    case 'auth/signUp': {
      return wsWrapper('auth/signUp', ws, async () => {
        const payload = AuthSchema.parse(data);
        const user = await auth.createUser({
          primaryKey: {
            providerId: 'email',
            providerUserId: payload.email,
            password: payload.password,
          },
          attributes: {},
        });
        context.userId = user.userId;
        const session = await auth.createSession(context.userId);
        context.sessionId = session.sessionId;
        send(ws, {
          t: 'auth/signedUp',
          data: { id: context.userId, sessionId: context.sessionId },
        });
      });
    }
    case 'auth/signOut': {
      return wsWrapper('auth/signOut', ws, async () => {
        try {
          await auth.invalidateSession(context.sessionId);
        } catch (e) {
          console.error(e);
        }
        context.userId = '';
        context.sessionId = '';
        send(ws, { t: 'auth/signedOut', data: {} });
      });
    }
  }
}
