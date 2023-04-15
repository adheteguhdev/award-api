import * as mongoose from 'mongoose';
import moment from 'moment';
import { v4 } from 'uuid';
const Schema = mongoose.Schema;

const AwardSchema = new Schema({
  _id: { type: String, default: v4 },
  type: { type: String, trim: true },
  point: { type: Number },
  name: { type: String, trim: true },
  imageUrl: { type: String },
  isDeleted: { type: Boolean, default: false, index: true },
  createdAt: { type: Date, default: moment().format() },
  updatedAt: { type: Date, default: moment().format() },
}, {
  collection: 'awards',
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_, award) => {
      award.id = award._id;
      delete award._id;
      delete award.isDeleted;
    },
  },
});

const Award = mongoose.model('Award', AwardSchema);

export default Award;
