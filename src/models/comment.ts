import {model, Schema} from "mongoose";
import isEmail from "validator/lib/isEmail";

interface Comment {
  author: string;
  description: string;
  shortDescription: string;
  likes: Schema.Types.ObjectId;
  totallikes: String;
  createdAt: Date;
}

const CommentSchema = new Schema<Comment>({
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  likes: {
    type: [Schema.Types.ObjectId],
    ref: "user",
    required: true,
    default: []
  },
  totallikes: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  }

})

export default model<Comment>("comment",CommentSchema);