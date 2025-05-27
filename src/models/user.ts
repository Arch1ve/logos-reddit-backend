import {model, Schema} from "mongoose";
import isEmail from "validator/lib/isEmail";

interface User {
  password: string;
  email: string;
  username: string;
}

const UserSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail]
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    maxlength: 20
  },
  password: {
    type: String,
    required: true
  }
})




export default model<User>("user", UserSchema);