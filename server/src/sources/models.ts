export type MediaType = 'anime' | 'manga' | 'novel'

export interface Media {
  readonly id: number
  readonly title: string
  readonly type: MediaType
}

export interface Details {
  readonly mediaType: string
}

export interface AnimeDetails extends Details {
  readonly episodes: number
  readonly year: number
}

export interface MangaDetails extends Details {
  readonly chapters: number
}

export interface NovelDetails extends Details {
  readonly chapters: number
}

export interface Score {
  readonly url: string
  readonly source: string
  readonly value: number
  readonly numScored?: number
}

export interface DetailsApiResponse {
  readonly details: Details
  readonly scores: Score[]
}