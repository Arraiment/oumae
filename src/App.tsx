import { Component, Show } from "solid-js";
import { useStore } from "./utils/store";

import Autocomplete from "./components/Autcomplete";
import Details from "./components/Details";

const App: Component = () => {
  const [store, { searchFor }] = useStore()
  const handleSearch = ({ currentTarget }) => {
    const query = currentTarget.value.trim()
    if (query) {
      searchFor(query)
    }
  }

  return (
    <>
      <h1>Oumae</h1>
      <input type="text" onchange={(e) => handleSearch(e)} />
      <Show when={!store.loading} fallback={<p>Loading...</p>}>
        <Autocomplete />
        <Details />
      </Show>
    </>
  );
};

export default App;
