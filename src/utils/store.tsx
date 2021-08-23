import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store"
import { Anime } from "./models";

type Store = [
  {
    query: string,
    loading: boolean,
    anime?: Anime
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
          setState("query", query)
          console.log(`Query set: ${state.query}`);
        },
        toggleLoading(state: boolean) {
          state ? console.log('Now loading') : console.log('Loading done')
          setState("loading", state)
        },
        setAnime(anime: Anime) {
          setState("anime", anime)
          console.log(state.anime)
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