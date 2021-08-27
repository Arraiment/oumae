import { Anime } from "./models"
import { DetailsApiResponse, Media } from "../../server/src/sources/models"

export const fetchSuggestions =
  async (query: string, type: string = 'anime'): Promise<Anime[]> => {
    console.log("Fetching suggestions...")
    
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${type}`)
    
    if (response.ok) {
      const data = await response.json()
      return data.map((result: Media) => {
        return new Anime(result.id.toString(), result.title)
      })
    } else {
      throw 'Error fetching suggestions'
    }

  }

export const fetchDetails = async (media: Media) => {
  console.log(`Fetching details...`)

  const response = await fetch(`/api/details`, {
    method: 'POST',
    body: JSON.stringify(media)
  })

  if (response.ok) {
    return await response.json() as DetailsApiResponse
  } else {
    throw 'Error fetching details'
  }
}