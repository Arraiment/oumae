import { Component, createEffect, createSignal, Show, For } from "solid-js";
import { fetchDetails } from "../utils/queries";
import { AnimeDetails, Score } from "../utils/models"
import { useStore } from "../utils/store";

import ScoreDisplay from "./ScoreDisplay";

const Details: Component = () => {
  const [store, { toggleLoading }] = useStore()
  const [details, setDetails] = createSignal<AnimeDetails>()
  const [scores, setScores] = createSignal<Score[]>()

  createEffect(() => {
    console.log(store.anime);
  })

  createEffect(() => {
    if (store.anime !== null) {
      console.log(store.anime)

      fetchDetails(store.anime).then(results => {
        setDetails(results.details)
        setScores(results.scores)
        toggleLoading(false)
      }).catch(
        error => console.log(error)
      ).finally()
    }
  })

  return (
    <div>
      <Show when={details()} fallback={() => <p>No anime selected</p>}>
        <div class="details">
          <h1>{details().title}</h1>
          <h3>{details().type}</h3>
          <h3>{details().episodes}</h3>
        </div>
        <For each={scores()}>{score =>
          <ScoreDisplay score={score} />
        }</For>
      </Show>
    </div>
  );
};

export default Details;