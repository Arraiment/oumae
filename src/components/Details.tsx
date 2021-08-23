import { Component, createEffect, createSignal, Show, For } from "solid-js";
import { fetchDetails } from "../utils/queries";
import { Anime, AnimeDetails, Score } from "../utils/models";

import ScoreDisplay from "./ScoreDisplay";

const Details: Component<{anime: Anime}> = (props) => {
  const [details, setDetails] = createSignal<AnimeDetails>();
  const [scores, setScores] = createSignal<Score[]>();

  createEffect(() => {
    if (props.anime) {
      setDetails()
      console.log(props.anime)
      fetchDetails(props.anime).then(results => {
        setDetails(results.details)
        setScores(results.scores)
      })
      .catch(error => console.log(error))
      .finally()
    }
  })

  return (
    <div id="details-component">
      <Show when={details()} fallback={() => <p>Loading...</p>}>
        <div class="details">
          <h1>{details().title}</h1>
          <h3>{details().type} | {details().episodes}</h3>
        </div>
        <For each={scores()}>{score =>
          <ScoreDisplay score={score} />
        }</For>
      </Show>
    </div>
  );
};

export default Details;