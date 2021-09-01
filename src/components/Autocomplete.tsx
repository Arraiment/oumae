import type { Component } from "solid-js";
import { createEffect, createSignal } from "solid-js";
import { Switch, Match, Index } from "solid-js";
import type { Media } from "../../server/src/sources/models";
import { fetchSuggestions } from "../utils/queries";
import { useAppStore } from "../utils/store";

const Autocomplete: Component = () => {
  const [state, { select }] = useAppStore();
  const [error, setError] = createSignal(false)
  const [loading, setLoading] = createSignal(false)
  const [results, setResults] = createSignal<Media[]>()

  createEffect(() => {
    // Prevents calling fetch on inital load
    // as query is initialised as empty string
    if (state.autocomplete.query) {
      console.time('Suggestions')
      setError(false)
      setResults()
      setLoading(true)
      fetchSuggestions(
        state.autocomplete.query,
        state.autocomplete.type
        ).then(results => {
          setResults(results)
        }).catch(error => {
          console.error(error)
          setError(true)
        })
        .finally(() => {
          console.timeEnd('Suggestions')
          setLoading(false)
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
    console.log(option)
  }

  return (
    <div id="autocomplete-container">
      <Switch>
        <Match when={error()}>
          <p>No anime matches name "{state.autocomplete.query}"</p>
        </Match>
        <Match when={loading()}>
          <p>Searching for '{state.autocomplete.query}'...</p>
        </Match>
        <Match when={results()}>
          <Index each={results()}>{result =>
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