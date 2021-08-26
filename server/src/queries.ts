import phin from 'phin'
import { Result } from './sources/models'

export type MediaType = 'anime' | 'manga'

interface JikanResponse {
  request_cached: boolean,
  results: JikanResult[] | JikanResult
}

interface JikanResult {
  mal_id: number
  title: string
}

export const fetchSuggestions = async (query: string, type: MediaType): Promise<Result[]> => {
  console.log(`Fetching suggestions for ${type}: ${query}`)
  
  // Send request
  const response = await phin({
    url: `https://api.jikan.moe/v3/search/${type}?q=${query}&limit=5`,
    timeout: 8000,
    parse: 'json'
  })

  // If success
  if (response.statusCode == 200) {

    const json = response.body as JikanResponse

    if (Array.isArray(json.results)) {
      const results = json.results.map(result => {
        return new Result(result.mal_id, result.title, type)
      })
      return results
    } else {
      throw `[Fetch Suggestions] Failed to parse response\n${json}`
    }

  } else {
    throw `[Fetch Suggestions] Request failed: ${response.statusCode}`
  }
}
