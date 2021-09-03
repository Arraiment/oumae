import type { Component } from "solid-js";
import { useAppStore } from "../utils/store";

const Search: Component = () => {
  const [state, { search }] = useAppStore();
  let slider;

  let timer: NodeJS.Timeout
  const handleSearch = ({ currentTarget }) => {
    const checked: HTMLInputElement = document.querySelector('input[name="type"]:checked')
    const query: string = currentTarget.value.trim()

    // Cancels previous setTimeout if it has not executed
    clearTimeout(timer)
    // Starts new countdown until action is dispatched
    timer = setTimeout(() => {
      if (query.length > 3) {
        search(query, checked.id)
      }
    }, 1000)
  }

  const searchFocused = () => {
    document.getElementById('autocomplete-container').style.display = 'block'
  }

  const toggleSelection = () => {
    
  }


  return (
    <div id="header-container">
      <div id="selection">
        <h1>Find</h1>
        <div id="toggle" onClick={toggleSelection}>
          <div id="slider" ref={slider}></div>
          <div class="option">Anime</div>
          <div class="option">Manga</div>
        </div>
      </div>
      <div id="search-bar">
        <input
          type="text"
          id="search-input"
          onInput={handleSearch}
          onFocus={searchFocused}
          placeholder="titles..." />
        <p>Cancel</p>
      </div>
    </div>
  );
};

export default Search;