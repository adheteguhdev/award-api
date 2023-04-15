import * as mongoose from 'mongoose';
import moment from 'moment';
import { v4 } from 'uuid';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: { type: String, default: v4 },
  email: { type: String, trim: true },
  name: { type: String, trim: true },
  isDeleted: { type: Boolean, default: false, index: true },
  createdAt: { type: Date, default: moment().format() },
  updatedAt: { type: Date, default: moment().format() },
}, {
  collection: 'users',
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_, user) => {
      user.id = user._id;
      delete user._id;
      delete user.isDeleted;
    },
  },
});

const User = mongoose.model('User', UserSchema);

export default User;
