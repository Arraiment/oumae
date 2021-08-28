import type { Component } from "solid-js";
import { createEffect, For, Switch, Match } from "solid-js";
import { fetchDetails } from "../utils/queries";

import ScoreDisplay from "./ScoreDisplay";
import { createStore } from "solid-js/store";
import type { AnimeDetails, MangaDetails, Media, NovelDetails, Score } from "../../server/src/sources/models";

type Store = {
  loading: boolean
  error: boolean
  anime?: AnimeDetails
  manga?: MangaDetails
  novel?: NovelDetails
  scores: Score[]
}

const resetObj = {
  scores: [],
  anime: null,
  manga: null,
  novel: null
}

const DetailsDisplay: Component<{ media: Media }> = (props) => {
  const [state, setState] = createStore<Store>({
    loading: false,
    error: false,
    scores: []
  });

  createEffect(() => {
    if (props.media) {
      console.time('Details')
      setState({ ...resetObj, loading: true, error: false })
      fetchDetails(props.media).then(results => {
        switch (props.media.type) {
          case 'anime':
            setState("anime", results.details)
            break
          case 'manga':
            setState("manga", results.details)
            break
          case 'novel':
            setState("novel", results.details)
            break
          default:
            break
        }
        setState("scores", results.scores)
      })
        .catch(() => {
          setState({
            ...resetObj,
            error: true
          })
        })
        .finally(() => {
          console.timeEnd('Details')
          setState("loading", false)
        })
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
      <Match when={state.scores}>
        <div id="details">
          <Switch>
            <Match when={state.anime}>
              <h1>{state.anime.title} ({state.anime.year})</h1>
              <h3>{state.anime.mediaType} | {state.anime.episodes}</h3>
            </Match>
            <Match when={state.manga}>
              <h1>{state.manga.title}</h1>
              <h3>{state.manga.mediaType} | {state.manga.chapters}</h3>
            </Match>
            <Match when={state.novel}>
              <h1>{state.novel.title}</h1>
              <h3>{state.novel.mediaType} | {state.novel.chapters}</h3>
            </Match>
          </Switch>
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

export default DetailsDisplay