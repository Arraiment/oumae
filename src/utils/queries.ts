import { Anime, AnimeDetails, Score } from "./models"

const JIKAN_URL = "https://api.jikan.moe/v3"
const ANILIST_URL = "https://graphql.anilist.co"

type JikanResponse = {
  mal_id: number,
  url: string,
  title: string,
  type: string,
  episodes: number
  score: number,
  scored_by: number
}

type AnilistResponse = {

}

const fetchJson = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, options)
  if (response.ok) {
    return response.json()
  } else {
    console.error(`Request failed: ${response.status}`)
  }
}

export const fetchSuggestions = async (query: string): Promise<Anime[]> => {
  try {
    const data = await fetchJson(`${JIKAN_URL}/search/anime?q=${query}&limit=5`)
    return data['results'].map((anime: JikanResponse) => {
      return new Anime(anime.mal_id.toString(), anime.title)
    })
  } catch (error) {
    throw `Error fetching results: ${error}`
  }
}

// Also fetches anime details
export const fetchMalScore = async (id: string): Promise<[AnimeDetails, Score]> => {
  try {
    const data = await fetchJson(`${JIKAN_URL}/anime/${id}`) as JikanResponse
    const score = new Score(data.url, "MyAnimeList", data.score, data.scored_by)
    console.log(score)
    const details = new AnimeDetails(data.title, data.type, data.episodes)
    return [details, score]
  } catch (error) {
    throw `Error fetching results: ${error}`
  }
}

export const fetchAnilistScore = async (id: string) => {
  try {
    const query = `
      query {
        Media (idMal: ${id}, type: ANIME) {
          id
          title {
            english
          }
          averageScore
        }
      }
    `
    const response = await fetchJson(`${ANILIST_URL}`, {
      method: 'POST',
      body: query
    })
    const data = response.data['data']['Media']
    const score = new Score(data['url'], "AniList", data['score'], data['scored_by'])
    console.log(score)
    return score
  } catch (error) {
    throw `Error fetching results: ${error}`
  }
}