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
  data: {
    Media: {
      url: string,
      title: {
        english: string
      },
      score: number,
      scored_by: number
    }
  }
}

const fetchJson = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, options)
  if (response.ok) {
    return response.json()
  } else {
    const error = await response.json()
    throw `Request failed: ${JSON.stringify(error)}`
  }
}

// For use in Autocomplete component
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

export const fetchDetails = async (anime: Anime) => {
  const [details, malScore] = await fetchMalScore(anime.id)
  const anilistScore = await fetchAnilistScore(anime.id)
  return {
    details: details,
    scores: [
      malScore,
      anilistScore
    ]
  }
}

// Also fetches anime details
const fetchMalScore = async (id: string): Promise<[AnimeDetails, Score]> => {
  try {
    const data = await fetchJson(`${JIKAN_URL}/anime/${id}`) as JikanResponse
    const score = new Score(data.url, "MyAnimeList", data.score * 10, data.scored_by)
    const details = new AnimeDetails(data.title, data.type, data.episodes)
    return [details, score]
  } catch (error) {
    throw `Error fetching results: ${error}`
  }
}

const fetchAnilistScore = async (id: string) => {
  const query = `{
    Media (idMal: ${id}, type: ANIME) {
      url: siteUrl
      title {
        english
      }
      score: averageScore
      scored_by: popularity
    }
  }`
  try {
    const response = await fetchJson(`${ANILIST_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        query: query
      })
    }) as AnilistResponse
    const data = response.data.Media
    return new Score(data.url, "AniList", data.score, data.scored_by) 
  } catch (error) {
    throw `Error fetching results: ${error}`
  }
}