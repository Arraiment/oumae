export class Result {
  constructor(
    readonly id: number,
    readonly title: string,
    readonly type: 'anime' | 'manga'
  ){}
}