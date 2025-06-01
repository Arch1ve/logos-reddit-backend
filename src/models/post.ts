import {model, Schema} from "mongoose";

interface Post {
  author: Schema.Types.ObjectId;
  title: string;
  description: string;
  shortDescription: string;
  likes: Schema.Types.ObjectId[];
  totallikes: Number;
  createdAt: Date;
  comments: Schema.Types.ObjectId[];
}

const PostSchema = new Schema<Post>({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user',
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