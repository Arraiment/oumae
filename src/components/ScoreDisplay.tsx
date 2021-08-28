import type { Component } from "solid-js";
import { Show } from "solid-js";
import type { Score } from "../../server/src/sources/models";

const ScoreDisplay: Component<{ score: Score }> = (props: { score: Score }) => {
  return (
    <Show when={props.score.value > 0}
    fallback={<p>Couldn't find anime in {props.score.source}</p>}>
    <a href={props.score.url} class="btn" target="_blank">
      <h1>{props.score.source}</h1>
      <p>{props.score.value}
        <Show when={props.score.numScored}>
          <span> according to {props.score.numScored} people</span>
        </Show>
      </p>
    </a>
    </Show>
  );
};

export default ScoreDisplay;