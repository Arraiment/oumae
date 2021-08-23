import { Component, Show } from "solid-js";
import { Score } from "../utils/models";

const ScoreDisplay: Component<{ score: Score }> = (props: { score: Score }) => {
  return (
    <a href={props.score.url} class="btn" target="_blank">
      <h1>{props.score.source}</h1>
      <p>{props.score.value} according to</p>
      <Show when={props.score.numScored !== null}>
        <p>{props.score.numScored} people</p>
      </Show>
    </a>
  );
};

export default ScoreDisplay;