import phin from 'phin'
import { queryMalApi } from './sources/mal'
import { Details, DetailsApiResponse, Media, MediaType, Score } from './sources/models'

export interface JikanResult {
  mal_id: number
  title: string
  url: string
  type: string
  episodes: number
  aired: {
    prop: {
      from: {
        year: number
      }
    }
  }
  score: number,
  scored_by: number
}

export const fetchSuggestions = async (query: string, type: MediaType): Promise<Media[]> => {
  console.log(`Fetching suggestions for ${type}: ${query}`)

  const response = await phin({
    url: `https://api.jikan.moe/v3/search/${type}?q=${query}&limit=5`,
    timeout: 8000,
    parse: 'json'
  })

  if (response.statusCode == 200) {
    // Cast body as generic json object
    const json = response.body as Record<string, unknown>
    // Cast results property as properly typed object representation
    const results = json['results'] as JikanResult[]

    return results.map(result => {
      return {
        id: result.mal_id,
        title: result.title,
        type: type
      }
    })

  } else {
    throw `[Fetch Suggestions] Request failed: ${response.statusCode}`
  }
}

export const fetchDetails = async (media: Media): Promise<DetailsApiResponse> => {
  let responseDetails: Details
  const responseScores: Score[] = []
  
  switch (media.type) {
    case 'anime': {
      const [details, malScore] = await queryMalApi(media.id, media.type)
      responseDetails = details
      responseScores.push(malScore)
      break
    }
    case 'manga': {
      const [details, malScore] = await queryMalApi(media.id, media.type)
      responseDetails = details
      responseScores.push(malScore)
      break
    }
    // TODO: novels
    // case 'novel': {
    //   break
    // }
    default: {
      throw 'Unexpected media type'
    }
  }

  return {
    details: responseDetails,
    scores: responseScores
  }
}