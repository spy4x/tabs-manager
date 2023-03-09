import { goto } from '$app/navigation';
import type { AuthError } from '@models';
import { get, writable } from 'svelte/store';
import { getSocket } from '../services/ws';

const socket = await getSocket();
const LOCAL_STORAGE_KEY_USER_ID = 'auth_user_id';
const LOCAL_STORAGE_KEY_SESSION_ID = 'auth_session_id';

export interface AuthStore {
  userId: string;
  sessionId: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: AuthError;
}

const initialState: AuthStore = {
  userId: localStorage.getItem(LOCAL_STORAGE_KEY_USER_ID) || '',
  sessionId: localStorage.getItem(LOCAL_STORAGE_KEY_SESSION_ID) || '',
  isAuthenticated: false,
  isLoading: false,
  error: undefined,
};

const store = writable<AuthStore>(initialState);

function setState(state: Partial<AuthStore>) {
  store.update((s) => ({ ...s, ...state }));
}

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data.toString());
  switch (message.t) {
    case 'auth/signedIn':
    case 'auth/signedUp': {
      setState({
        userId: message.data.id,
        sessionId: message.data.sessionId,
        isAuthenticated: true,
        isLoading: false,
        error: undefined,
      });
      localStorage.setItem(LOCAL_STORAGE_KEY_USER_ID, message.data.id);
      localStorage.setItem(LOCAL_STORAGE_KEY_SESSION_ID, message.data.sessionId);
      goto('/');
      return;
    }
    case 'auth/signedOut': {
      setState({
        userId: '',
        sessionId: '',
        isAuthenticated: false,
        isLoading: false,
        error: undefined,
      });
      localStorage.removeItem(LOCAL_STORAGE_KEY_USER_ID);
      localStorage.removeItem(LOCAL_STORAGE_KEY_SESSION_ID);
      return;
    }
    case 'auth/signIn/error':
    case 'auth/signUp/error':
    case 'auth/signOut/error': {
      setState({ isLoading: false, error: message.data });
      return;
    }
  }
});

export const authStore = {
  subscribe: store.subscribe,
  signIn: (email: string, password: string) => {
    setState({ isLoading: true, error: undefined });
    socket.send(JSON.stringify({ t: 'auth/signIn', data: { email, password } }));
  },
  signUp: (email: string, password: string) => {
    setState({ isLoading: true, error: undefined });
    socket.send(JSON.stringify({ t: 'auth/signUp', data: { email, password } }));
  },
  signOut: () => {
    setState({ isLoading: true, error: undefined });
    socket.send(JSON.stringify({ t: 'auth/signOut' }));
  },
  reset: () => {
    setState(initialState);
  },
};

const state = get(authStore);
if (state.userId && state.sessionId && !state.isAuthenticated) {
  socket.send(
    JSON.stringify({
      t: 'auth/reSignIn',
      data: { id: state.userId, sessionId: state.sessionId },
    }),
  );
}
