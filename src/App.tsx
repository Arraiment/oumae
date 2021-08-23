import { Component, createResource, createSignal, Show, Index, createEffect } from "solid-js";
import { createStore } from "solid-js/store"

import { Anime } from "./utils/models";
import { fetchSuggestions } from "./utils/queries";

import Details from "./components/Details";
import { setAttribute } from "solid-js/web";


const App: Component = () => {
  const [state, setState] = createStore({
    loading: false,
    error: false,
    query: '',
    results: []
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

  const [selected, setSelected] = createSignal<Anime>()

  let timer: number
  const handleSearch = ({ currentTarget }) => {
    // Only set loading if loading is not already true
    if (!state.loading) {
      setState("loading", true)
    }
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
    setSelected(
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
        {state.loading
          ? "Loading..."
          : <Show when={!state.error}
            fallback={() => <p>No anime matches name "{state.query}"</p>}>
            <Index each={state.results}>{result =>
              <button onClick={selectAnime} id={result().id.toString()}>{result().title}</button>
            }</Index>
          </Show>}
      </div>
      
      {/* Details */}
      <Show when={selected()}>
        {<Details anime={selected()} />}
      </Show>
    </>
  );
};

export default App;
