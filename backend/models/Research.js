const mongoose = require('mongoose');

const researchSchema = new mongoose.Schema({
  title: String,
  value: Number,
  description: String
});

module.exports = mongoose.model('Research', researchSchema);
