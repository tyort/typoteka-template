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

export type Comment = {
  id: string,
  text: string
}
