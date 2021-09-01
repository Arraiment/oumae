import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import type { Media } from "../../server/src/sources/models";

type AppStore = [
  {
    autocomplete: {
      query: string,
      type: string
    },
    media: Media
  },
  {
    search?: (query: string, type: string) => void;
    select?: (media: Media) => void;
  }
]

const AppStoreContext = createContext<AppStore>();

export function AppStoreProvider(props: { children: any }) {
  const [state, setState] = createStore({
    autocomplete: {
      query: '',
      type: 'anime'
    },
    media: undefined
  }),
    store: AppStore = [
      state,
      {
        search(query: string, type: string) {
          console.log(query + type);
          setState('autocomplete', 'type', type);
          setState('autocomplete', 'query', query);
        },
        select(media: Media) {
          setState('media', media)
        }
      }
    ];

  return (
    <AppStoreContext.Provider value={store}>
      {props.children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() { return useContext(AppStoreContext); }