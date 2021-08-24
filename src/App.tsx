import { Component, Index, Switch, Match, createEffect } from "solid-js";
import { createStore } from "solid-js/store"

import { Anime } from "./utils/models";
import { fetchSuggestions } from "./utils/queries";

import Details from "./components/Details";

type Store = {
  loading: boolean
  error: boolean
  query: string
  results: Anime[]
  selected: Anime
}

const App: Component = () => {
  const [state, setState] = createStore<Store>({
    loading: false,
    error: false,
    query: '',
    results: [],
    selected: null
  })

  createEffect(() => {
    // Prevents calling fetch on inital load
    // as query is initialised as empty string
    if (state.query) {
      fetchSuggestions(state.query).then(results => {
        setState("results", results)
      }).catch(error => setState("error", true))
        .finally(() => setState("loading", false))
    }
  })

  let timer: number
  const handleSearch = ({ currentTarget }) => {
    // Only set loading if loading is not already true
    if (!state.loading) {
      setState("loading", true)
    }
    setState("error", false)
    const input = currentTarget.value.trim()
    // Stops previous setTimeout if it has not executed
    // Currently only sets query after user stops for 2 sec
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (input && input !== state.query && input.length > 3) {
        setState("query", input)
      }
    }, 1000);
  }

  const selectAnime = ({ currentTarget }) => {
    setState("selected",
      new Anime(currentTarget.id, currentTarget.textContent)
    )
  }

  return (
    <>
      <h1>Oumae</h1>
      {/* Search */}
      <input type="text" onInput={(e) => handleSearch(e)} />

      {/* Autocomplete */}
      <div id="autocomplete-container">
        <Switch>
          <Match when={state.error}>
            <p>No anime matches name "{state.query}"</p>
          </Match>
          <Match when={state.loading}>
            <p>Loading...</p>
          </Match>
          <Match when={state.results}>
            <Index each={state.results}>{result =>
              <button onClick={selectAnime} id={result().id.toString()}>{result().title}</button>
            }</Index>
          </Match>
        </Switch>
      </div>

      {/* Details */}
      <div id="details-container">
        <Details anime={state.selected} />
      </div>
    </>
  );
};

export default App;
