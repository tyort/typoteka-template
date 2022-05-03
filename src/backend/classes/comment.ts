import { Sequelize } from "sequelize";
import { Comment } from "../../types";

export class CommentService {
  private _Comment;
  constructor(sequelize: Sequelize) {
    this._Comment = sequelize.models.Comment;
  }

  create(articleId: number, comment: Comment) {
    if (comment.text) {
      return this._Comment.create({
        articleId,
        ...comment
      });

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

    return !!deletedRows;
  }

  findAll(articleId: number) {
    return this._Comment.findAll({
      where: {articleId},
      raw: true // ???????
    });
  }
}

export default CommentService;
