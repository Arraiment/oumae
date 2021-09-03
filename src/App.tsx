import type { Component } from "solid-js";
import { onMount, onCleanup } from "solid-js";

import DetailsDisplay from "./components/DetailsDisplay";
import Search from "./components/Search";
import Autocomplete from "./components/Autocomplete";

const App: Component = () => {
  onMount(() => window.addEventListener('click', unfocusAutocomplete))
  onCleanup(() => window.removeEventListener('click', unfocusAutocomplete))

  const unfocusAutocomplete = (event: MouseEvent) => {
    const element = event.target as HTMLElement
    if (element.id !== 'search-input' && element.id !== 'autocomplete-container') {
      document.getElementById('autocomplete-container').style.display = 'none'
    }
  }
  
  return (
    <>
      <Search />
      <div id="main-content">  
        <Autocomplete />
        <DetailsDisplay />
      </div>
    </>
  );
};

export default App;
