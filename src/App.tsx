import { Component, Show } from "solid-js";
import { useStore } from "./utils/store";

import Autocomplete from "./components/Autcomplete";
import Details from "./components/Details";

const App: Component = () => {
  const [store, { searchFor }] = useStore()
  let timer: number
  const handleSearch = ({ currentTarget }) => {
    const query = currentTarget.value.trim()
    // Stops previous setTimeout if it has not executed
    // Currently only sets query after user stops for 2 sec
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (query) {
        searchFor(query)
      }
    }, 2000);
  }

  return (
    <>
      <h1>Oumae</h1>
      <input type="text" onInput={(e) => handleSearch(e)} />
      <Show when={!store.loading} fallback={<p>Loading...</p>}>
        <Autocomplete />
        <Details />
      </Show>
    </>
  );
};

export default App;
