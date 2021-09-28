import type { Component } from "solid-js";
import { useAppStore } from "../utils/store";

const Search: Component = () => {
  const [state, { search }] = useAppStore();
  let searchElement: HTMLInputElement

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

  const clearSearch = () => {
    searchElement.value = ""
    search("", "anime")
  }

  return (
    <div id="header-container">
      <div id="radio">
          <h1>Find </h1>
          <input type="radio" value="Anime" id="anime" name="type" checked />
          <input type="radio" value="Manga" id="manga" name="type" />
      </div>
      <div id="search-bar">
        <input
          type="text"
          ref={searchElement}
          id="search-input"
          onInput={handleSearch}
          onFocus={searchFocused}
          placeholder="title..." />
        <p onClick={clearSearch}>cancel</p>
      </div>
    </div>
  );
};

export default Search;