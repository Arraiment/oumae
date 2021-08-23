export class Anime {
  id: string;
  title: string;

  constructor(id: string, title: string) {
    this.id = id;
    this.title = title;
  }
}

export class AnimeDetails {
  constructor(
    readonly title: string,
    readonly type: string,
    readonly episodes: string
  ){}
}

export class Score {
  constructor(
    readonly url: string,
    readonly source: string,
    readonly value: number,
    readonly numScored?: number
  ){}
}