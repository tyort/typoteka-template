import { nanoid } from "nanoid";
import { Publication, Comment } from "../../types";

export class CommentService {
  create(article: Publication, comment: Omit<Comment, `id`>) {
    const newComment = {...comment, id: nanoid(6)} as Comment;
    article.comments.push(newComment);
    return newComment;
  }

  delete(article: Publication, articleId: string) {
    const deletedComment = article.comments
      .find((item) => item.id === articleId);

    if (deletedComment) {
      article.comments = article.comments
        .filter((item) => item.id !== articleId);

      return deletedComment;

    } else {
      return null;
    }
  }

  findAll(article: Publication) {
    return article.comments;
  }
}

export default CommentService;
