import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store"
import { Anime } from "./queries";

type Store = [
  {
    query: string,
    loading: boolean,
    anime?: {
      id: string,
      title: string
    }
  },
  {
    searchFor?: (query: string) => void;
    toggleLoading?: (state: boolean) => void;
    setAnime?: (anime: Anime) => void;
  }
];

const StoreContext = createContext<Store>();

export function Provider(props) {
  const [state, setState] = createStore({ 
    query: '', 
    loading: false,
    anime: null
  }),
    store: Store = [
      state,
      {
        searchFor(query: string) {
          setState("query", query);
        },
        toggleLoading(state: boolean) {
          setState("loading", state)
        },
        setAnime(anime: Anime) {
          setState("anime", anime)
        }
      }
    ];

  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  );
}

export function useStore() { return useContext(StoreContext); }