import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const AccommodationSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    host: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    maxGuests: { type: Number, required: true },
  },
  { timestamps: true }
);

AccommodationSchema.methods.toJSON = function () {
  const schema = this;
  const object = schema.toObject();
  delete object.__v;

  return object;
};

export default model('Accommodations', AccommodationSchema);
