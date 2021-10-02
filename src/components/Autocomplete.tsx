import type { Component } from "solid-js";
import { createEffect, createSignal } from "solid-js";
import { Switch, Match, Index } from "solid-js";
import { createStore } from "solid-js/store";
import type { Media } from "../../server/src/sources/models";
import { fetchSuggestions } from "../utils/queries";
import { useAppStore } from "../utils/store";

type InternalStore = {
  error: boolean,
  loading: boolean,
  results: Media[]
}

const Autocomplete: Component = () => {
  const [state, { select }] = useAppStore()
  const [internal, setInternal] = createStore<InternalStore>({
    error: false,
    loading: false,
    results: []
  })

  createEffect(() => {
    // Prevents calling fetch on inital load
    // as query is initialised as empty string
    if (state.query) {
      setInternal({
        error: false,
        loading: true,
        results: []
      })
      fetchSuggestions(state.query, state.queryType)
        .then(results => setInternal('results', results))
        .catch(error => {
          console.error(error)
          setInternal('error', true)
        })
        .finally(() => {
          setInternal('loading', false)
        })
    }
  })

  const selectOption = ({ currentTarget }) => {
    let option: Media
    try {
      option = JSON.parse(currentTarget.getAttribute("data-json"))
      select(option)
    } catch (error) {
      console.error('Error parsing option json: ' + error)
    }
  }

  return (
    <div id="autocomplete-container">
      <Switch>
        <Match when={internal.error}>
          <p>No anime matches name "{state.query}"</p>
        </Match>
        <Match when={internal.loading}>
          <p>Searching for "{state.query}"...</p>
        </Match>
        <Match when={internal.results.length > 0}>
          <Index each={internal.results}>{result =>
            <button
              class="autocomplete-option"
              onClick={selectOption}
              data-json={JSON.stringify(result())}>
              {result().title}
            </button>
          }</Index>
        </Match>
      </Switch>
    </div>
  );
};

export default Autocomplete;