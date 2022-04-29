// ?????? Разобраться с типами
export type Publication = {
  id: string,
  picture: string,
  announce: string,
  title: string,
  fullText: string,
  createdDate: string,
  category: string[],
  comments: Comment[]
}

// ?????? Разобраться с типами
export type ArticleAttributes = {
  id: number,
  picture: string,
  announce: string,
  title: string,
  fullText: string,
  createdAt: Date,
  updatedAt: Date,
}

export type Comment = {
  id: string,
  text: string
}
