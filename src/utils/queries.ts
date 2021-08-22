import axios from "axios"

const JIKAN_URL = "https://api.jikan.moe/v3"
const ANILIST_URL = "https://graphql.anilist.co"

export class Anime {
  id: string
  title: string

  constructor (id: string, title: string) {
    this.id = id
    this.title = title
  }
}

export class AnimeDetails {
  constructor(
    readonly title: string,
    readonly type: string,
    readonly episodes: string
  ){}
}

export class Score {
  constructor(
    readonly url: string,
    readonly source: string,
    readonly value: number,
    readonly numScored?: number
  ){}
}

type JikanApiResponse = {
  mal_id: number,
  title: string
}[]

export const fetchSuggestions = async (query: string) => {
  try {
    const response = await axios.get(`${JIKAN_URL}/search/anime?q=${query}&limit=5`)
    const data = response.data['results'] as JikanApiResponse
    return data.map(anime => {
      return new Anime(anime.mal_id.toString(), anime.title)
    })
  } catch (error) {
    console.error(`Error fetching results: ${error}`)
  }
}

// Also fetches anime details
export const fetchMalScore = async (id: string): Promise<[AnimeDetails, Score]> => {
  try {
    const response = await axios.get(`${JIKAN_URL}/anime/${id}`)
    const data = response.data
    const score = new Score(data['url'], "MyAnimeList", data['score'], data['scored_by'])
    console.log(score)
    const details = new AnimeDetails(data['title'], data['type'], data['episodes'])
    return [details, score]
  } catch (error) {
    console.error(`Error fetching results: ${error}`)
  }
}

export const fetchAnilistScore = async (id: string) => {
  try {
    const query = `
      query {
        Media (idMal: ${id}, type: ANIME) {
          id
          title
            english
          averageScore
        }
      }
    `
    const response = await axios.post(`${ANILIST_URL}`, query)
    const data = response.data['data']['Media']
    const score = new Score(data['url'], "AniList", data['score'], data['scored_by'])
    console.log(score)
    return score
  } catch (error) {
    console.error(`Error fetching results: ${error}`)
  }
}