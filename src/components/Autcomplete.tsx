import { Component, createEffect, Show, Index, createSignal } from "solid-js";
import { Anime, fetchSuggestions } from "../queries";
import { Provider, useStore } from "../store";

const Autocomplete: Component = () => {
  const [store, { searchFor, toggleLoading, setAnime }] = useStore()
  const [results, setResults] = createSignal<Anime[]>([])
  createEffect(() => {
    if (store.query) {
      fetchSuggestions(store.query)
      .then(results => {
        setResults(results)
        toggleLoading(false)
      })
    }
  })

  const handleClick = ({ currentTarget }) => {
    console.log(currentTarget.textContent)
    console.log(currentTarget.id)
    toggleLoading(true)
    setAnime(new Anime(
      currentTarget.id,
      currentTarget.textContent
    ))
  }

  return (
    <div>
      <Show when={!store.loading} fallback={() => <p>{store.query}</p>}>
        <Index each={results()}>{(result, i) =>
          <button onClick={handleClick} id={result().id.toString()}>{result().title}</button>
        }</Index>
      </Show>
    </div>
  );
};

export default Autocomplete;