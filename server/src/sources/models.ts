export type MediaType = 'anime' | 'manga'

export interface Media {
  readonly id: number
  readonly title: string
  readonly type: MediaType
}

export interface Details {
  readonly mediaType: string
  readonly title: string
}

export interface AnimeDetails extends Details {
  readonly episodes: number
  readonly year: number
}

export interface MangaDetails extends Details {
  readonly chapters: number
  readonly publishing: boolean
}

export interface Score {
  readonly url: string
  readonly source: string
  readonly value: number
  readonly numScored?: number
}

export interface DetailsApiResponse {
  readonly details: AnimeDetails | MangaDetails
  readonly scores: Score[]
}