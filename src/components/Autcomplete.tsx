import { Component, createEffect, Show, Index, createSignal } from "solid-js";
import { fetchSuggestions } from "../utils/queries";
import { Anime } from "../utils/models";
import { useStore } from "../utils/store";

const Autocomplete: Component = () => {
  const [store, { toggleLoading, setAnime }] = useStore()
  const [results, setResults] = createSignal<Anime[]>([])

  let query: string

  createEffect(() => {    
    if (store.query && query != store.query) {
      query = store.query

      fetchSuggestions(store.query)
      .then(results => {
        setResults(results)
        toggleLoading(false)
      })
    }
  })

  const handleClick = ({ currentTarget }) => {
    setAnime(new Anime(
      currentTarget.id,
      currentTarget.textContent
    ))
  }

  return (
    <div>
      <Show when={!store.loading} fallback={() => <p>{store.query}</p>}>
        <Index each={results()}>{result =>
          <button onClick={handleClick} id={result().id.toString()}>{result().title}</button>
        }</Index>
      </Show>
    </div>
  );
};

export default Autocomplete;