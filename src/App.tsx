import type { Component } from "solid-js";
import { Index, Switch, Match, createEffect } from "solid-js";
import { createStore } from "solid-js/store"

import { fetchSuggestions } from "./utils/queries";

import DetailsDisplay from "./components/DetailsDisplay";
import type { Media } from "../server/src/sources/models";

type Store = {
  loading: boolean
  error: boolean
  query: string
  results: Media[]
  selected: Media
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
      console.time('Suggestions')
      fetchSuggestions(state.query).then(results => {
        setState("results", results)
      }).catch(error => setState("error", true))
        .finally(() => {
          console.timeEnd('Suggestions')
          setState("loading", false)
        })
    }
  })

  let timer: NodeJS.Timeout
  const handleSearch = ({ currentTarget }) => {
    // Only set loading if loading is not already true
    if (!state.loading) {
      setState("loading", true)
    }
    setState("error", false)
    const input = currentTarget.value.trim()
    // Stops previous setTimeout if it has not executed
    // Currently sets query after user stops for 1 sec
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (input && input !== state.query && input.length > 3) {
        setState("query", input)
      }
    }, 1000);
  }

  const selectOption = ({ currentTarget }) => {
    let option: Media
    try {
      option = JSON.parse(currentTarget.getAttribute("data-json"))
    } catch (error) {
      console.error('Error parsing option json: ' + error)
    }
    setState("selected", option)
  }

  return (
    <>
      <h1>Oumae</h1>
      {/* Search */}
      <input
        id="search-input"
        type="text"
        onInput={(e) => handleSearch(e)} />

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
              <button 
                onClick={selectOption}
                data-json={JSON.stringify(result())}>
                {result().title}
              </button>
            }</Index>
          </Match>
        </Switch>
      </div>

      {/* Details */}
      <div id="details-container">
        <DetailsDisplay media={state.selected} />
      </div>
    </>
  );
};

export default App;
