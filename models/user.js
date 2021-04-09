const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  membershipStatus: { type: String, required: true },
});

UserSchema.virtual('username').get(() => {
  return this.email;
});