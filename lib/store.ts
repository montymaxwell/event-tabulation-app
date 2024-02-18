import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Event } from './types';
import { EventData, User } from './models';
import { supabase } from './supabase';

import * as Device from 'expo-device';

type ZustandStore<T> = {
  value: T;
  write: (data: T) => void;
  reset: () => void;
};

type ZustandStoreArray<T> = {
  value: T[];
  write: (data: T[]) => void;
  append: (data: T) => void;
  get: (id: string) => void;
  reset: () => void;
};

type UserStore = {
  value: User & { client: string | null };
  init: () => void;
  check: () => boolean;
  getID: () => string;
  write: (data: User) => void;
  reset: () => void;
}

export type ScorableEvent = {
  candidate: string,
  criterias: Array<number> // using criteria as indexes
}

export type Score = {
  id: string,
  owner: string,
  candidates: Array<ScorableEvent> // using candidates as indexes
}

type ScoreList = {
  value: Score,
  write: (data: Score) => void;
  append: (data: Partial<Score>) => void;
  appendToList: (data: ScorableEvent) => void;
  get: (id: string) => ScorableEvent | null;
  reset: () => void;
}

export const useUser = create<UserStore>()(
  persist(
    (set, get) => ({
      value: {
        id: '',
        client: null,
        email: '',
        username: null,
      },
      init: () => {
        if (get().value.client === null) {
          supabase.from('clients').insert({ device: { ...Device } }).select().then(({ error, data }) => {
            if (error) {
              console.log(error);
              return;
            }
  
            set((prev) => ({ value: { ...prev.value, client: data[0].id } }));
          })
        }
      },
      getID: () => {
        if (get().value.email.length > 0) {
          return get().value.id;
        }
        else {
          return get().value.client!;
        }
      },
      check: () => {
        if (get().value.email.length > 0 && get().value.id.length > 0) {
          return true;
        }

        return false;
      },
      write: (data) => {
        set((prev) => ({ value: { client: prev.value.client, ...data } }));
      },
      reset: () => {
        set((prev) => ({ 
          value: {
            id: '',
            email: '',
            username: null,
            client: prev.value.client,
          }
        }));
      },
    }),
    {
      name: 'current-user',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// type ClientStore = {
//   id: string | null,
//   init: () => void
// }

// export const useClient = create<ClientStore>()(
//   persist((set, get) => ({
//     id: null,
//     init: () => {
//       const id = get().id;
//       if (id === null) {
//         supabase.from('client').insert({ device_name: Device.brand }).select('*').then(({ error, data }) => {
//           if (error) {
//             console.log(error);
//             return;
//           }

//           set(() => ({ id: data[0].id }));
//         })
//       }
//     }

//   }), { name: 'client', storage: createJSONStorage(() => AsyncStorage) })
// )

export const useEventForm = create<ZustandStore<EventData> & { append: (data: Partial<EventData>) => void }>((set) => ({
    value: {
      id: '',
      name: '',
      owner: '',
      description: '',
      location: '',
      criteriaList: [],
      candidateList: []
    },
    write: (data) => {
      set(() => ({ value: data }));
    },
    reset: () => {
      set({
        value: {
          id: '',
          name: '',
          owner: '',
          description: '',
          location: '',
          criteriaList: [],
          candidateList: []
        }
      })
    },
    append: (data) => {
      set((prev) => ({ value: { ...prev.value, ...data } }));
    }
}))

export const useScore = create<ScoreList>()(
  persist((set, get) => ({
    value: {
      id: '',
      owner: '',
      candidates: []
    },
    write: (data) => {
      set(() => ({ value: data }));
    },
    append: (data) => {
      set((prev) => ({ value: { ...prev.value, ...data } }));
    },
    appendToList: (data) => {
      // set((prev) => ({ value: { ...prev.value, events: [...prev.value.events, data] } }))
    },
    get: (id: string) => {
      // const items = get().value.candidates.filter((v) => v.id === id);
      // if (items.length > 0) {
      //   return items[0];
      // }

      return null;
    },
    reset: () => {
      set({
        value: {
          id: '',
          owner: '',
          candidates: []
        }
      })
    }

  }), { name: 'user-score', storage: createJSONStorage(() => AsyncStorage) })
)

export const useEvents = create<ZustandStoreArray<Event>>()(
  persist(
    (set, get) => ({
      value: [],
      write: (data) => {
        set(() => ({ value: [...data] }));
      },
      append: (data) => {
        set((prev) => ({ value: [...prev.value, {...data}] }));
      },
      get: (id) => {
        return get().value.filter((v) => v.id === id);
      },
      reset: () => {
        set({});
      },
    }),
    { name: 'events', storage: createJSONStorage(() => AsyncStorage) }
  )
);
