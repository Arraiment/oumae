import type { Component } from "solid-js";
import { createEffect, For, Switch, Match } from "solid-js";
import { fetchDetails } from "../utils/queries";

import ScoreDisplay from "./ScoreDisplay";
import { createStore } from "solid-js/store";
import type { AnimeDetails, MangaDetails, NovelDetails, Score } from "../../server/src/sources/models";
import { useAppStore } from "../utils/store";

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

const DetailsDisplay: Component = () => {
  const [store, setStore] = createStore<Store>({
    loading: false,
    error: false,
    scores: []
  });
  const [state] = useAppStore()

  createEffect(() => {
    if (state.media) {
      console.time('Details')
      setStore({ ...resetObj, loading: true, error: false })
      fetchDetails(state.media).then(results => {
        switch (state.media.type) {
          case 'anime':
            setStore("anime", results.details)
            break
          case 'manga':
            setStore("manga", results.details)
            break
          case 'novel':
            setStore("novel", results.details)
            break
          default:
            break
        }
        setStore("scores", results.scores)
      })
        .catch(() => {
          setStore({
            ...resetObj,
            error: true
          })
        })
        .finally(() => {
          console.timeEnd('Details')
          setStore("loading", false)
        })
    }
  })

  return (
    <Switch>
      <Match when={store.error}>
        <p>Error occured while fetching anime info, check the logs</p>
      </Match>
      <Match when={store.loading}>
        <p>Loading...</p>
      </Match>
      <Match when={store.scores}>
        <div id="details">
          <Switch>
            <Match when={store.anime}>
              <h1>{store.anime.title} ({store.anime.year})</h1>
              <h3>{store.anime.mediaType} | {store.anime.episodes}</h3>
            </Match>
            <Match when={store.manga}>
              <h1>{store.manga.title}</h1>
              <h3>{store.manga.mediaType} | {store.manga.chapters}</h3>
            </Match>
            <Match when={store.novel}>
              <h1>{store.novel.title}</h1>
              <h3>{store.novel.mediaType} | {store.novel.chapters}</h3>
            </Match>
          </Switch>
        </div>
        <div id="scores">
          <For each={store.scores}>{score =>
            <ScoreDisplay score={score} />
          }</For>
        </div>
      </Match>
    </Switch>
  );
};

export default DetailsDisplay