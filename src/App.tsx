import { Component, Show } from "solid-js";
import Autocomplete from "./components/Autcomplete";
import Details from "./components/Details";
import { Provider, useStore } from "./store";

const App: Component = () => {
  const [store, { searchFor, toggleLoading }] = useStore()
  const handleSearch = ({ currentTarget }) => {
    const query = currentTarget.value.trim()
    if (query) {
      searchFor(query) 
      toggleLoading(true)
    }
  }

  return (
      <div>
          <Show when={store.loading}>
            <p>Loading...</p>
          </Show>
        <input type="text" onchange={(e) => handleSearch(e)} />
        <Autocomplete />
        <Details />
      </div>
  );
};

export default App;
