export type ArticleAttributes = {
  picture: string,
  announce: string,
  title: string,
  fullText: string,
  categories: string[] | number[],
  comments: Comment[]
}

export type Comment = {
  text: string
}
