import { Component, createEffect, For, Switch, Match } from "solid-js";
import { fetchDetails } from "../utils/queries";
import { Anime, AnimeDetails, Score } from "../utils/models";

import ScoreDisplay from "./ScoreDisplay";
import { createStore } from "solid-js/store";

type Store = {
  loading: boolean
  error: boolean
  details: AnimeDetails
  scores: Score[]
}

const Details: Component<{ anime: Anime }> = (props) => {
  const [state, setState] = createStore<Store>({
    loading: false,
    error: false,
    details: null,
    scores: []
  });

  createEffect(() => {
    if (props.anime) {
      setState({ loading: true, error: false })
      fetchDetails(props.anime).then(results => {
        setState("details", results.details)
        setState("scores", results.scores)
      })
        .catch(() => {
          setState({
            details: null,
            scores: [],
            error: true
          })
        })
        .finally(() => setState("loading", false))
    }
  })

  return (
    <Switch>
      <Match when={state.error}>
        <p>Error occured while fetching anime info, check the logs</p>
      </Match>
      <Match when={state.loading}>
        <p>Loading...</p>
      </Match>
      <Match when={state.details && state.scores}>
        <div id="details">
          <h1>{state.details.title}</h1>
          <h3>{state.details.type} | {state.details.episodes}</h3>
        </div>
        <div id="scores">
          <For each={state.scores}>{score =>
            <ScoreDisplay score={score} />
          }</For>
        </div>
      </Match>
    </Switch>
  );
};

export default Details;