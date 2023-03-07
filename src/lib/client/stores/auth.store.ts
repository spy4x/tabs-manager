import { goto } from '$app/navigation';
import { get, writable } from 'svelte/store';
import { getSocket } from '../services/ws';

const socket = await getSocket();
const LOCAL_STORAGE_KEY = 'auth';

export interface AuthStore {
  user?: {
    id: string;
    sessionId: string;
  };
  isLoading: boolean;
  error?: string;
}

const initialState: AuthStore = {
  user: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || 'null'),
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
      setState({ user: message.data, isLoading: false, error: undefined });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(message.data));
      goto('/');
      return;
    }
    case 'auth/signedOut': {
      setState({ user: undefined, isLoading: false, error: undefined });
      localStorage.removeItem(LOCAL_STORAGE_KEY);
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
};

const state = get(authStore);
if (state.user) {
  socket.send(
    JSON.stringify({
      t: 'auth/reSignIn',
      data: { id: state.user.id, sessionId: state.user.sessionId },
    }),
  );
}
