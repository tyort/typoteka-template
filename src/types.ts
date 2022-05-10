export type ArticleAttributes = {
  picture: string | null,
  announce: string,
  title: string,
  fullText: string | null,
  categories: string[] | number[]
}

export type Comment = {
  text: string
}
