import { Component, createEffect, Show, Index, createSignal } from "solid-js";
import { Anime, AnimeDetails, fetchMalScore, fetchSuggestions } from "../queries";
import { Provider, useStore } from "../store";

const Details: Component = () => {
  const [store, { searchFor, toggleLoading }] = useStore()
  const [results, setResults] = createSignal<AnimeDetails>()
  createEffect(() => {
    if (store.anime !== null) {
      console.log(store.anime);
      
      fetchMalScore(store.anime['id'])
        .then(results => {
          setResults(results)
          toggleLoading(false)
        })
    }
  })

  return (
    <Show when={!store.loading && store.anime !== null} fallback={() => <p>No anime selected</p>}>
      <div>
        <h1>{ results().title }</h1>
        <h3>{ results().type }</h3>
        <h3>{ results().episodes }</h3>
        <p>{ results().score }</p>
      </div>
    </Show>
  );
};

export default Details;