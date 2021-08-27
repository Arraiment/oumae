import phin from "phin"
import stringSimilarity from "string-similarity"
import { Score } from "./models"

interface KitsuResponse {
  data: {
    attributes: {
      canonicalTitle: string
      slug: string
      averageRating?: string
      userCount: number
    }
  }[]
}

export const queryKitsuApi = async (title: string): Promise<Score> => {
  const params = new URLSearchParams({
    'filter[text]': title,
    'fields[anime]': 'canonicalTitle,slug,averageRating,userCount'
  })
  try {

    const response = await phin({
      url: `https://kitsu.io/api/edge/anime?${params}`,
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json'
      },
      timeout: 8000,
      parse: 'json'
    })

    if (response.statusCode === 200) {

      const json = response.body as KitsuResponse
      const data = json.data

      const { bestMatchIndex } = stringSimilarity.findBestMatch(title,
        data.map(results =>
          results.attributes.canonicalTitle
        )
      )
      const bestMatch = data[bestMatchIndex].attributes
      return {
        url: `https://kitsu.io/anime/${bestMatch.slug}`,
        source: 'Kitsu',
        value: parseRating(bestMatch.averageRating),
        numScored: bestMatch.userCount
      }

    } else {
      throw `Request failed: ${response.statusCode}`
    }


  } catch (error) {
    console.warn(`[Kitsu] ${error}`);
    return {
      url: '',
      source: 'Kitsu', 
      value: -1
    }
  }
}

const parseRating = (rating: string | undefined) => {
  if (typeof rating === 'string') {
    return parseInt(rating)
  } else {
    return -1
  }
}