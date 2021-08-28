import * as cheerio from 'cheerio'
import phin from 'phin'
import { Score } from './models'

export const scrapeRal = async (id: number): Promise<Score> => {

  try {

    const url = `http://www.redditanimelist.net/anime.php?anime=${id}`
    const response = await phin({
      url: url,
      timeout: 8000,
      parse: 'string'
    })

    if (response.statusCode == 200) {

      const $ = cheerio.load(response.body);
      const rows = $('div.info2 tbody tr')
      const scoreNode = rows.get(2).lastChild
      const voterNode = rows.get(5).lastChild

      if (!scoreNode) {
        throw 'No score found'
      }
      const score = $(scoreNode).text()
      const voters = voterNode ? $(voterNode).text() : null

      return {
        url: url,
        source: 'RedditAnimeList',
        value: parseFloat(score),
        numScored: voters ? parseInt(voters) : undefined
      }

    } else {
      throw `Request failed: ${response.statusCode}`
    }
  } catch (error) {
    console.warn(`[RAL] ${error}`);
    return {
      url: '',
      source: 'RedditAnimeList',
      value: -1
    }
  }

}