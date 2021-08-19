import axios from "axios"

const BASE_URL = "https://api.jikan.moe/v3"

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
    readonly episodes: string,
    readonly score: string,
    readonly scored_by: string,
  ){}
}

export const fetchSuggestions = async (query: string) => {
  try {
    const url = `${BASE_URL}/search/anime?q=${query}&limit=5`
    const response = await axios.get(url)
    return parseResults(response.data['results'])
  } catch (error) {
    console.error(`Error fetching results: ${error}`)
  }
}

const parseResults = (results: []): Anime[] => {
  let array: Anime[] = []
  results.forEach(anime => {
      let obj = new Anime(anime['mal_id'], anime['title'])
      array.push(obj)
  })
  return array
}

export const fetchMalScore = async (id: string) => {
  try {
    const url = `${BASE_URL}/anime/${id}`
    const response = await axios.get(url)
    const data = response.data
    console.log(data);
    return new AnimeDetails(
      data['title'],
      data['type'],
      data['episodes'],
      data['score'],
      data['scored_by'],
    )
  } catch (error) {
    console.error(`Error fetching results: ${error}`)
  }
}