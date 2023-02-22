import { writable } from 'svelte/store';
import type { Link } from '@prisma/client';
import { getSocket } from '../services/ws';

const socket = await getSocket();

export interface LinkStore {
  links: Link[];
  isAdding: boolean;
  addError: string | undefined;
}

const initialState: LinkStore = {
  links: [],
  isAdding: false,
  addError: undefined,
};

const store = writable<LinkStore>(initialState);

function setState(state: Partial<LinkStore>) {
  store.update((s) => ({ ...s, ...state }));
}

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data.toString());
  switch (message.t) {
    case 'link/list': {
      setState({ links: message.data });
      return;
    }
    case 'link/add/success': {
      store.update((s) => ({ ...s, links: [...s.links, message.data], isAdding: false }));
      return;
    }
    case 'link/add/error': {
      setState({ addError: message.data, isAdding: false });
      return;
    }
  }
});

export const linkStore = {
  subscribe: store.subscribe,
  add: (link: Link) => {
    setState({ isAdding: true, addError: undefined });
    socket.send(JSON.stringify({ t: 'link/add', data: link }));
  },
  fetchList: () => {
    setState({ links: [] });
    socket.send(JSON.stringify({ t: 'link/list' }));
  },
};

linkStore.fetchList();
