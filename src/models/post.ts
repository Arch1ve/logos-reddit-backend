import {model, Schema} from "mongoose";
import isEmail from "validator/lib/isEmail";

interface Post {
  author: string;
  title: string;
  description: string;
  shortDescription: string;
  likes: Schema.Types.ObjectId;
  totallikes: String;
  createdAt: Date;
}

const PostSchema = new Schema<Post>({
  author: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String
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
    default: 0,
  },
  createdAt: {
    type: Date,
    required: false,
    default: Date.now,
  }

})

export default model<Post>("post", PostSchema);