import type { Component } from "solid-js";
import { useAppStore } from "../utils/store";

const Search: Component = () => {
  const [state, { search }] = useAppStore();

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


  return (
    <div id="search-bar">
      <div class="radio">
        <input type="radio" value="Anime" id="anime" name="type" checked />
        <input type="radio" value="Manga" id="manga" name="type" />
        <input type="radio" value="Novel" id="novel" name="type" />
      </div>
      <input
        type="text"
        id="search-input"
        onInput={handleSearch}
        onFocus={searchFocused}
        placeholder="Search titles..." />
    </div>
  );
};

export default Search;