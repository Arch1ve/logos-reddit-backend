import {model, Schema} from "mongoose";

interface Comment {
  author: Schema.Types.ObjectId;
  description: string;
  shortDescription: string;
  likes: Schema.Types.ObjectId[];
  totallikes: Number;
  createdAt: Date;
}

const CommentSchema = new Schema<Comment>({
  author: {
    type: Schema.Types.ObjectId,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  likes: {
    type: [{type:Schema.Types.ObjectId, ref:"user"}],
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
  }

})

export default model<Comment>("comment",CommentSchema);