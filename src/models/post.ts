import {model, Schema} from "mongoose";
import isEmail from "validator/lib/isEmail";

interface Post {
  author: String;
  title: string;
  description: string;
  shortDescription: string;
  likes: Schema.Types.ObjectId[];
  totallikes: String;
  createdAt: Date;
  comments: Schema.Types.ObjectId[];
}

const PostSchema = new Schema<Post>({
  author: {
    type: String, 
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 25,
  },
  description: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 50,
  },
  likes: {
    type: [{type:Schema.Types.ObjectId, ref:"userlikes"}],
    required: true,
    default: []
  },
  totallikes: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  comments: {
    type: [{type:Schema.Types.ObjectId, ref:"comment"}],
    required: true,
    default: []
  }

})

export default model<Post>("post", PostSchema);