import { derived, writable } from 'svelte/store';
import type { Link, Tag, TagToLink } from '@prisma/client';
import { getSocket } from '../services/ws';
import type { LinkAddCommand, TagAddCommand } from '@models';
import { authStore } from './auth.store';

const socket = await getSocket();

interface Store {
  link: {
    ids: string[];
    data: { [id: string]: Link };
    isFetching: boolean;
    fetchError?: string;
    isAdding: boolean;
    addError?: string;
  };
  tag: {
    ids: string[];
    data: { [id: string]: Tag };
    isFetching: boolean;
    fetchError?: string;
    isAdding: boolean;
    addError?: string;
  };
  tagToLink: {
    linkIds: string[];
    tagIds: string[];
    dataByLinkId: { [linkId: string]: TagToLink[] };
    dataByTagId: { [tagId: string]: TagToLink[] };
    isFetching: boolean;
    fetchError?: string;
  };
}

const initialState: Store = {
  link: {
    ids: [],
    data: {},
    isFetching: false,
    isAdding: false,
  },
  tag: {
    ids: [],
    data: {},
    isFetching: false,
    isAdding: false,
  },
  tagToLink: {
    linkIds: [],
    tagIds: [],
    isFetching: false,
    dataByLinkId: {},
    dataByTagId: {},
  },
};

const store = writable<Store>(initialState);

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data.toString());
  switch (message.t) {
    case 'link/list': {
      const links: Link[] = message.data;
      return store.update((state) => ({
        ...state,
        link: {
          ...state.link,
          ids: links.map((link) => link.id),
          data: links.reduce((acc, link) => ({ ...acc, [link.id]: link }), {}),
          isFetching: false,
          fetchError: undefined,
        },
      }));
    }
    case 'link/add/success': {
      const link: Link & { tags: TagToLink[] } = message.data;
      return store.update((state) => ({
        ...state,
        link: {
          ...state.link,
          ids: [...state.link.ids, link.id],
          data: { ...state.link.data, [link.id]: link },
          isAdding: false,
          addError: undefined,
        },
        tagToLink: {
          ...state.tagToLink,
          tagIds: [...state.tagToLink.tagIds, ...link.tags.map((tag) => tag.tagId)],
          linkIds: [...state.tagToLink.linkIds, ...link.tags.map((tag) => tag.linkId)],
          dataByTagId: link.tags.reduce(
            (acc, tag) => ({
              ...acc,
              [tag.tagId]: acc[tag.tagId] ? [...acc[tag.tagId], tag] : [tag],
            }),
            {} as { [tagId: string]: TagToLink[] },
          ),
          dataByLinkId: link.tags.reduce(
            (acc, tag) => ({
              ...acc,
              [tag.linkId]: acc[tag.linkId] ? [...acc[tag.linkId], tag] : [tag],
            }),
            {} as { [linkId: string]: TagToLink[] },
          ),
        },
      }));
    }
    case 'link/add/error': {
      return store.update((state) => ({
        ...state,
        link: {
          ...state.link,
          isAdding: false,
          addError: message.data,
        },
      }));
    }
    case 'tag/list': {
      const tags: Tag[] = message.data;
      return store.update((state) => ({
        ...state,
        tag: {
          ...state.tag,
          ids: tags.map((tag: Tag) => tag.id),
          data: tags.reduce((acc, tag) => ({ ...acc, [tag.id]: tag }), {}),
          isFetching: false,
          fetchError: undefined,
        },
      }));
    }
    case 'tag/add/success': {
      const tag: Tag = message.data;
      return store.update((state) => ({
        ...state,
        tag: {
          ...state.tag,
          ids: [...state.tag.ids, tag.id],
          data: { ...state.tag.data, [tag.id]: tag },
          isAdding: false,
          addError: undefined,
        },
      }));
    }
    case 'tag/add/error': {
      return store.update((state) => ({
        ...state,
        tag: {
          ...state.tag,
          isAdding: false,
          addError: message.data,
        },
      }));
    }
    case 'tag/link/list': {
      const tagsToLinks: TagToLink[] = message.data;
      return store.update((state) => ({
        ...state,
        tagToLink: {
          ...state.tagToLink,
          tagIds: tagsToLinks.map((tag: TagToLink) => tag.tagId),
          linkIds: tagsToLinks.map((tag: TagToLink) => tag.linkId),
          dataByTagId: tagsToLinks.reduce(
            (acc, tag) => ({
              ...acc,
              [tag.tagId]: acc[tag.tagId] ? [...acc[tag.tagId], tag] : [tag],
            }),
            {} as { [tagId: string]: TagToLink[] },
          ),
          dataByLinkId: tagsToLinks.reduce(
            (acc, tag) => ({
              ...acc,
              [tag.linkId]: acc[tag.linkId] ? [...acc[tag.linkId], tag] : [tag],
            }),
            {} as { [linkId: string]: TagToLink[] },
          ),
          isFetching: false,
          fetchError: undefined,
        },
      }));
    }
  }
});

export const linkStore = {
  subscribe: store.subscribe,
  link: {
    data: derived(store, (state): (Link & { tags: Tag[] })[] => {
      return state.link.ids.map((id) => {
        const link = state.link.data[id];
        const tagsToLink = state.tagToLink.dataByLinkId[link.id] || [];
        const tags = tagsToLink.reduce((acc, tagToLink) => {
          const tag = state.tag.data[tagToLink.tagId];
          if (tag) {
            return [...acc, tag];
          } else {
            return acc;
          }
        }, [] as Tag[]);
        return { ...link, tags };
      });
    }),
    add: (link: LinkAddCommand) => {
      store.update((state) => ({
        ...state,
        link: {
          ...state.link,
          isAdding: true,
          addError: undefined,
        },
      }));
      socket.send(JSON.stringify({ t: 'link/add', data: link }));
    },
    fetchList: () => {
      store.update((state) => ({
        ...state,
        link: {
          ...state.link,
          ids: [],
          data: {},
          isFetching: true,
          fetchError: undefined,
        },
      }));
      socket.send(JSON.stringify({ t: 'link/list' }));
    },
  },

  tags: {
    data: derived(store, (state): (Tag & { amount: number })[] => {
      return state.tag.ids.map((id) => {
        const tag = state.tag.data[id];
        const linksToTag = state.tagToLink.dataByTagId[tag.id] || [];
        const amount = linksToTag.length;
        return { ...tag, amount };
      });
    }),
    add: (tag: TagAddCommand) => {
      store.update((state) => ({
        ...state,
        tag: {
          ...state.tag,
          isAdding: true,
          addError: undefined,
        },
      }));
      socket.send(JSON.stringify({ t: 'tag/add', data: tag }));
    },
    fetchList: () => {
      store.update((state) => ({
        ...state,
        tag: {
          ...state.tag,
          ids: [],
          data: {},
          isFetching: true,
          fetchError: undefined,
        },
      }));
      socket.send(JSON.stringify({ t: 'tag/list' }));
    },
  },

  tagToLink: {
    fetchList: () => {
      store.update((state) => ({
        ...state,
        tagToLink: {
          ...state.tagToLink,
          isFetching: true,
          fetchError: undefined,
          tagIds: [],
          linkIds: [],
          dataByTagId: {},
          dataByLinkId: {},
        },
      }));
      socket.send(JSON.stringify({ t: 'tag/link/list' }));
    },
  },
};

let wasPreviouslyAuthenticated = false;
authStore.subscribe((state) => {
  if (state.isAuthenticated && !wasPreviouslyAuthenticated) {
    wasPreviouslyAuthenticated = true;
    linkStore.link.fetchList();
    linkStore.tags.fetchList();
    linkStore.tagToLink.fetchList();
  }
  if (wasPreviouslyAuthenticated && !state.isAuthenticated) {
    wasPreviouslyAuthenticated = false;
    store.set(initialState);
  }
});
