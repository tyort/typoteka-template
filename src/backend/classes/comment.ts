import { Comment as CommentAttributes} from "../../types";
import { Comment as CommentModel } from "../models/comment";


type AllModels = {
  Comment: typeof CommentModel
}

export class CommentService {
  private _Comment;
  constructor({Comment}: AllModels) {
    this._Comment = Comment;
  }

  async create(articleId: number, comment: CommentAttributes) {
    if (comment.text) {
      const createdComment: CommentModel = await this._Comment.create({
        articleId,
        ...comment
      });
      return createdComment; // ??????

    } else {
      return null;
    }
  }

  async delete(commentId: number) {
    const deletedRows = await this._Comment.destroy({
      where: {
        id: commentId
      }
    });

    return deletedRows;
  }

  async findAll(articleId: number) {
    const asdad = await this._Comment.findAll({
      where: {articleId},
      raw: true // ???????
    });
    return asdad; // ??????
  }
}

export default CommentService;
