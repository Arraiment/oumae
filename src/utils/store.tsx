import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import type { Media } from "../../server/src/sources/models";

type AppStore = [
  {
    query: string,
    queryType: string,
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
    query: '',
    queryType: 'anime',
    media: undefined
  }),
    store: AppStore = [
      state,
      {
        search(query: string, type: string) {
          setState('queryType', type)
          setState('query', query)
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