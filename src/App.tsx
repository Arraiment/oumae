import { Component, createResource, createSignal, Show, Index, createEffect } from "solid-js";
import Details from "./components/Details";

import { Anime } from "./utils/models";
import { fetchSuggestions } from "./utils/queries";

const App: Component = () => {
  const [query, setQuery] = createSignal<string>()
  const [results] = createResource(query, fetchSuggestions)

  createEffect(() => {
    console.error(results.error)
  })

  const [selected, setSelected] = createSignal<Anime>()

  let timer: number
  const handleSearch = ({ currentTarget }) => {
    
    const input = currentTarget.value.trim()
    // Stops previous setTimeout if it has not executed
    // Currently only sets query after user stops for 2 sec
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (input && input !== query() && input.length > 3) {
        setQuery(input)
        console.log(query())
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
      <input type="text" onInput={(e) => handleSearch(e)} />
      <span>{results.loading && "Loading..."}</span>
      <Show
        when={!results.error}
        fallback={() => <p>No anime matches name {query()}</p>}>
        <Index each={results()}>{result =>
          <button onClick={selectAnime} id={result().id.toString()}>{result().title}</button>
        }</Index>
      </Show>
      <Show when={selected()}>
        {<Details anime={selected()}/>}
      </Show>
    </>
  );
};

export default App;
