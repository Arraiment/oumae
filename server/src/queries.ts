import phin from 'phin'
import { queryAnilistApi } from './sources/anilist'
import { scrapeAnimePlanet } from './sources/animeplanet'
import { queryKitsuApi } from './sources/kitsu'
import { queryMalApi } from './sources/mal'
import { AnimeDetails, DetailsApiResponse, MangaDetails, Media, MediaType, Score } from './sources/models'
import { scrapeRal } from './sources/ral'

export interface JikanResult {
  mal_id: number
  title: string
  url: string
  score: number
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
  
  let responseDetails: AnimeDetails | MangaDetails
  const responseScores: Score[] = []
  
  switch (media.type) {
    case 'anime': {
      const results = await Promise.all([
        queryMalApi(media),
        queryAnilistApi(media),
        queryKitsuApi(media),
        scrapeRal(media.id),
        scrapeAnimePlanet(media)
      ])
      const scores = results.flat().slice(1) as Score[]
      responseDetails = results[0][0] as AnimeDetails
      responseScores.push(...scores)
      break
    }
    case 'manga': {
      const [details, malScore] = await queryMalApi(media)
      responseDetails = details as MangaDetails
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