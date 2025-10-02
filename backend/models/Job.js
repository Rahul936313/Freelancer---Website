const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  budget: Number,
  deadline: Date,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref:'User' }]
},{ timestamps:true });

module.exports = mongoose.model('Job', jobSchema);
