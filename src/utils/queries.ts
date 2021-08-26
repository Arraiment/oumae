import { Anime, AnimeDetails, Score } from "./models"
import stringSimilarity from 'string-similarity'
import { Result } from "../../server/src/sources/models"

const JIKAN_URL = "https://api.jikan.moe/v3"
const ANILIST_URL = "https://graphql.anilist.co"
const KITSU_URL = "https://kitsu.io/api/edge"

type JikanResponse = {
  mal_id: number
  url: string
  title: string
  type: string
  episodes: number
  year: number
  score: number
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

type KitsuResponse = {
  data: {
    attributes: {
      canonicalTitle: string
      slug: string
      averageRating?: string
      userCount: number
    }
  }[]
}

// Default fetch implementation with timeout
const fetchJson = async (url: string, options?: RequestInit) => {
  // Used to abort fetch on timeout
  const controller = new AbortController();
  const signal = controller.signal;

  // Starts timer for 8s, if response is not received, abort request
  const timeout = setTimeout(() => {
    controller.abort();
    console.error('[Fetch JSON] Request timed out');
  }, 8000);
  // Start request
  const response = await fetch(url, { ...options, signal: signal });
  // Aborts timer once response is received
  clearTimeout(timeout);

  if (response.ok) {
    return response.json() as Object
  } else {
    const error = await response.json()
    throw `[Fetch JSON] Request failed: ${JSON.stringify(error)}`
  }
}

// For use in Autocomplete component
export const fetchSuggestions = async (query: string, type: string = 'anime'): Promise<Anime[]> => {
  console.log("Fetching...")
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${type}`)
  if (response.ok) {
    const data = await response.json()
    return data.map((result: Result) => {
      return new Anime(result.id.toString(), result.title)
    })
  } else {
    throw 'Error fetching suggestions'
  }

}

export const fetchDetails = async (anime: Anime) => {
  console.log(`Fetching details for ${anime.title}`);
  const [details, malScore] = await fetchMalScore(anime.id)
  const anilistScore = await fetchAnilistScore(anime.id)
  const kitsuScore = await fetchKitsuScore(anime.title)
  return {
    details: details,
    scores: [
      malScore,
      anilistScore,
      kitsuScore
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
    throw `[MAL] ${error}`
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
      body: JSON.stringify({ query: query })
    }) as AnilistResponse
    const data = response.data.Media
    return new Score(data.url, "AniList", data.score, data.scored_by)
  } catch (error) {
    console.warn(`[AniList] ${error}`);
    return new Score('', 'AniList', -1);
  }
}

const fetchKitsuScore = async (title: string) => {
  const params = new URLSearchParams({
    'filter[text]': title,
    'fields[anime]': 'canonicalTitle,slug,averageRating,userCount'
  })
  try {
    const response = await fetchJson(`${KITSU_URL}/anime?` + params, {
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json'
      }
    }) as KitsuResponse
    const data = response.data
    const { bestMatchIndex } = stringSimilarity.findBestMatch(title,
      data.map(results =>
        results.attributes.canonicalTitle
      )
    )
    const bestMatch = data[bestMatchIndex].attributes
    return new Score(
      `https://kitsu.io/anime/${bestMatch.slug}`,
      'Kitsu',
      parseInt(bestMatch.averageRating),
      bestMatch.userCount
    )
  } catch (error) {
    console.warn(`[Kitsu] ${error}`);
    return new Score('', 'Kitsu', -1)
  }
}