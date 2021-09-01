import phin from "phin"
import { JikanResult } from "../queries"
import { AnimeDetails, Details, MangaDetails, Media, Score } from "./models"

interface JikanAnime extends JikanResult {
  type: string
  episodes: number
  aired: {
    prop: {
      from: {
        year: number
      }
    }
  }
}

interface JikanManga extends JikanResult {
  type: string
  chapters: number
  publishing: boolean
}

export const queryMalApi = async ({ id, type }: Media): Promise<[Details, Score]> => {

  const response = await phin({
    url: `https://api.jikan.moe/v3/${type}/${id}`,
    timeout: 8000,
    parse: 'json'
  })

  if (response.statusCode == 200) {

    if (type === 'anime') {
      const result = response.body as JikanAnime

      const details: AnimeDetails = {
        mediaType: result.type,
        title: result.title,
        episodes: result.episodes,
        year: result.aired.prop.from.year
      }
      const score: Score = {
        url: result.url,
        source: 'MyAnimeList',
        value: result.score * 10,
        numScored: result.scored_by
      }
      return [details, score]

    } else if (type === 'manga') {
      const result = response.body as JikanManga

      const details: MangaDetails = {
        mediaType: result.type,
        title: result.title,
        chapters: result.chapters,
        publishing: result.publishing
      }
      const score: Score = {
        url: result.url,
        source: 'MyAnimeList',
        value: result.score * 10,
        numScored: result.scored_by
      }
      return [details, score]

    } else {
      throw `Invalid type`
    }

  } else {
    throw `[MAL] Request failed: ${response.statusCode}`
  }
}