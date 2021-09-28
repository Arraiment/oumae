import type { Component } from "solid-js";
import { Show } from "solid-js";
import type { Score } from "../../server/src/sources/models";

const ScoreDisplay: Component<{ score: Score }> = (props: { score: Score }) => {
  const convertScore = (score: number) => {
    if (score > 85) {
      return 120
    } else if (score < 65) {
      return 0
    } else {
      return (score - 65) / 0.2 * 1.2
    }
  }
  return (
    <Show when={props.score.value > 0}
      fallback={<p>Couldn't find a score from {props.score.source}</p>}>
      <a href={props.score.url} class="btn" target="_blank">
        <h1>{props.score.source}</h1>
        <p style={{
          'color': `hsl(${convertScore(props.score.value)}, 80%, 68%)`
        }}>{props.score.value.toFixed(2)}
          <Show when={props.score.numScored}>
            <span> according to {props.score.numScored} people</span>
          </Show>
        </p>
      </a>
    </Show>
  );
};

export default ScoreDisplay;