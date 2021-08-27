import phin from "phin"
import { JikanResult } from "../queries"
import { AnimeDetails, Details, MediaType, Score } from "./models"

export const queryMalApi = async (id: number, type: MediaType): Promise<[Details, Score]> => {
  console.log(`Fetching details from Jikan`)

  // Send request
  const response = await phin({
    url: `https://api.jikan.moe/v3/${type}/${id}`,
    timeout: 8000,
    parse: 'json'
  })

  // If success
  if (response.statusCode == 200) {

    const result = response.body as JikanResult

    if (type === 'anime') {

      const details: AnimeDetails = {
        mediaType: result.type,
        episodes: result.episodes,
        year: result.aired.prop.from.year
      }
      const score: Score = {
        url: result.url,
        source: 'MyAnimeList',
        value: result.score,
        numScored: result.scored_by
      }
      return [details, score]

    } else {
      throw `Invalid type`
    }

  } else {
    throw `[Fetch MAL] Request failed: ${response.statusCode}`
  }
}