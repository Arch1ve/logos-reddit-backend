import {Document, Model, model, Schema} from "mongoose";
import isEmail from "validator/lib/isEmail";
import bcrypt from 'bcryptjs';

interface IUser {
  password: string;
  email: string;
  username: string;
}

interface UserModel extends Model<IUser> {
  findUserByCredentials: (email: string, password: string) => Promise<Document<unknown, any, IUser>>
}

const UserSchema = new Schema<IUser, UserModel>({
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

UserSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Неправильные почта или пароль'));
        }

        return user;
      });
    });
});


export default model<IUser, UserModel>("user", UserSchema);