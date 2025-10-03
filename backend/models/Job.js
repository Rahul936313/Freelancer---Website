const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  budget: Number,
  category: String,
  skills: [{ type: String }],
  deadline: Date,
  status: { type: String, enum: ['open','closed'], default: 'open' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref:'User' }]
},{ timestamps:true });

module.exports = mongoose.model('Job', jobSchema);
