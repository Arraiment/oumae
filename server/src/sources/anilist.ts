import phin from "phin"
import { Media, Score } from "./models"

interface AniListResponse {
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

export const queryAnilistApi = async ({ id, type }: Media): Promise<Score> => {

  const query = `{
    Media(idMal: ${id}, type: ${type.toUpperCase()}) {
      url: siteUrl
      title {
        english
      }
      score: averageScore
      scored_by: popularity
    }
  }`  
  try {

    const response = await phin({
      url: 'https://graphql.anilist.co',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: JSON.stringify({ query: query }),
      timeout: 8000,
      parse: 'json'
    })

    if (response.statusCode == 200) {

      const json = response.body as unknown as AniListResponse
      const data = json.data.Media
      
      return {
        url: data.url, 
        source: "AniList", 
        value: data.score, 
        numScored: data.scored_by
      }

    } else {
      throw `Request failed: ${response.statusCode}\n${JSON.stringify(response.body)}`
    }

  } catch (error) {
    console.warn(`[AniList] ${error}`);
    return {
      url: '',
      source: 'AniList',
      value: -1
    }
  }
}