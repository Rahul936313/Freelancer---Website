const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  // ensure no maxlength that truncates bcrypt hash
  password: { type: String, required: true },
  role: { type: String, enum: ['freelancer','client'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
