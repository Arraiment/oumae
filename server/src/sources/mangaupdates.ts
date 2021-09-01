import * as cheerio from 'cheerio'
import phin from 'phin'
import stringSimilarity from 'string-similarity'
import { Score } from './models'

export const scrapeMangaUpdates = async (title: string): Promise<Score> => {

  try {
    // Use MAL title to match with MU's database
    const searchResponse = await phin({
      url: `https://www.mangaupdates.com/series.html?search=${encodeURIComponent(title)}`,
      timeout: 8000,
      parse: 'string'
    })

    if (searchResponse.statusCode !== 200) {
      throw `Request failed: ${searchResponse.statusCode}`
    }
    const $ = cheerio.load(searchResponse.body)
    const results: string[] = []
    $('div.d-flex.flex-column.h-100 div.text > a').each((_index, element) => {
      results.push($(element).text())
    })
    
    const { bestMatchIndex } = stringSimilarity.findBestMatch(title,
      results 
    )
    const bestMatchUrl = $('div.d-flex.flex-column.h-100 div.text > a').get(bestMatchIndex).attribs.href
      
    const response = await phin({
      url: bestMatchUrl,
      timeout: 8000,
      parse: 'string'
    })

    if (response.statusCode == 200) {

      const $ = cheerio.load(response.body);
      const rating = $('div.sContent:contains(Bayesian Average:)').text()
      if (!rating) {
        throw 'No score found'
      }
      // Sample string: "(5350 votes)Bayesian Average: 7.69 / 10.0"
      const regexp = new RegExp(/([0-9]+?) votes\)Bayesian Average: (.*) \/ 10/, 'g');
      const match = regexp.exec(rating)

      if (!match) {
        throw `Invalid score format`
      }
      
      return {
        url: bestMatchUrl,
        source: 'AnimePlanet',
        value: parseFloat(match[2]) * 10,
        numScored: parseInt(match[1])
      }

    } else {
      throw `Request failed: ${searchResponse.statusCode}`
    }
  } catch (error) {
    console.warn(`[MU] ${error}`);
    return {
      url: '',
      source: 'MangaUpdates',
      value: -1
    }
  }

}