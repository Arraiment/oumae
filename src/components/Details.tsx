import { Component, createEffect, createSignal, Show, For } from "solid-js";
import { fetchMalScore } from "../utils/queries";
import { AnimeDetails, Score } from "../utils/models"
import { useStore } from "../utils/store";

import ScoreDisplay from "./ScoreDisplay";

const Details: Component = () => {
  const [store, { toggleLoading }] = useStore()
  const [details, setDetails] = createSignal<AnimeDetails>()
  const [scores, setScores] = createSignal<Score[]>()

  createEffect(() => {
    if (store.anime !== null) {
      console.log(store.anime)
      // Clear scores
      setScores([])

      fetchMalScore(store.anime['id']).then(results => {
          setDetails(results[0])
          setScores(scores => [...scores, results[1]])
          toggleLoading(false)
        }).catch(
          error => console.log(error)
        )
    }
  })

  return (
    <Show when={!store.loading && store.anime !== null} fallback={() => <p>No anime selected</p>}>
      <div class="details">
        <h1>{details().title}</h1>
        <h3>{details().type}</h3>
        <h3>{details().episodes}</h3>
      </div>
      <For each={scores()}>{score =>
        <ScoreDisplay score={score} />
      }</For>
    </Show>
  );
};

export default Details;