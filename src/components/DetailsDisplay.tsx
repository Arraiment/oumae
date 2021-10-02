import type { Component } from "solid-js";
import { createEffect, For, Switch, Match } from "solid-js";
import { createStore } from "solid-js/store";
import fitty from "fitty";

import { fetchDetails } from "../utils/queries";
import ScoreDisplay from "./ScoreDisplay";
import type { AnimeDetails, MangaDetails, Score } from "../../server/src/sources/models";
import { useAppStore } from "../utils/store";


type InternalStore = {
  loading: boolean
  error: boolean
  anime?: AnimeDetails
  manga?: MangaDetails
  scores: Score[]
}

const resetObj = {
  scores: [],
  anime: undefined,
  manga: undefined,
}

const DetailsDisplay: Component = () => {
  const [internal, setInternal] = createStore<InternalStore>({
    loading: false,
    error: false,
    scores: []
  });
  const [state] = useAppStore()
  let detailsElement: HTMLDivElement

  createEffect(() => {
    if (state.media) {
      setInternal({ ...resetObj, loading: true, error: false })
      fetchDetails(state.media).then(results => {
        switch (state.media.type) {
          case 'anime':
            setInternal('anime', results.details)
            break
          case 'manga':
            setInternal('manga', results.details)
            break
          default:
            break
        }
        setInternal('scores', results.scores)
      })
        .catch(error => {
          console.error(error)
          setInternal('error', true)
        })
        .finally(() => {
          setInternal('loading', false)
          fitty(".detail-title", {
            minSize: 20,
            multiLine: true,
            maxSize: 40
          })
        })
    }
  })

  return (
    <Switch>
      <Match when={internal.error}>
        <p>Error occured while fetching {state.media.type} info, check the logs</p>
      </Match>
      <Match when={internal.loading}>
        <p>Loading...</p>
      </Match>
      <Match when={internal.scores}>
        <div id="details" ref={detailsElement}>
          <Switch>
            <Match when={internal.anime}>
              <h1 class="detail-title">
                {internal.anime.title}
              </h1>
              <h3>{internal.anime.year} {internal.anime.mediaType} | {internal.anime.episodes} episodes</h3>
            </Match>
            <Match when={internal.manga}>
              <h1 class="detail-title">
                {internal.manga.title}
              </h1>
              <h3>
                {internal.manga.publishing ? "Ongoing" : "Completed"} {internal.manga.mediaType}
                {internal.manga.publishing ? "" : ` | ${internal.manga.chapters}`}
              </h3>
            </Match>
          </Switch>
        </div>
        <div id="scores">
          <For each={internal.scores}>{score =>
            <ScoreDisplay score={score} />
          }</For>
        </div>
      </Match>
    </Switch>
  );
};

export default DetailsDisplay