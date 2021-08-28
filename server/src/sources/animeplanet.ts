import * as cheerio from 'cheerio'
import phin from 'phin'
import stringSimilarity from 'string-similarity'
import { Media, Score } from './models'

interface APResponse {
  data: {
    url: string,
    name: string
  }[]
}

const BASE_URL = 'https://www.anime-planet.com'

export const scrapeAnimePlanet = async ({ title, type }: Media): Promise<Score> => {

  try {
    // Use MAL title to match with AP's database
    const autoCompResponse = await phin({
      url: `${BASE_URL}/autocomplete?type=${type}&q=${title}`,
      timeout: 8000,
      parse: 'json'
    })

    if (autoCompResponse.statusCode !== 200) {
      throw `Request failed: ${autoCompResponse.statusCode}`
    }
    const json = autoCompResponse.body as APResponse
    const { bestMatchIndex } = stringSimilarity.findBestMatch(title,
      json.data.map(e => e.name)
    )
    const bestMatchUrl = `${BASE_URL}${json.data[bestMatchIndex].url}`
      
    const response = await phin({
      url: bestMatchUrl,
      timeout: 8000,
      parse: 'string'
    })

    if (response.statusCode == 200) {

      const $ = cheerio.load(response.body);
      const rating = $('div.avgRating').attr('title')
      if (!rating) {
        throw 'No score found'
      }
      // Sample string: "4.145 out of 5 from 120,805 votes"
      
      const regexp = new RegExp("^(.*) out of 5 from (.*) votes", "g");
      const match = regexp.exec(rating)

      if (!match) {
        throw `Invalid score format`
      }

      return {
        url: bestMatchUrl,
        source: 'AnimePlanet',
        value: parseFloat(match[0]) * 20,
        numScored: parseInt(match[1].replace(',', ''))
      }

    } else {
      throw `Request failed: ${autoCompResponse.statusCode}`
    }
  } catch (error) {
    console.warn(`[AP] ${error}`);
    return {
      url: '',
      source: 'AnimePlanet',
      value: -1
    }
  }

}