const Job = require('../models/Job');

exports.getJobs = async (req,res)=>{
  try{
    const jobs = await Job.find().populate('postedBy','name');
    res.json(jobs);
  } catch(err){ res.status(500).json({ message: err.message }); }
};

exports.createJob = async (req,res)=>{
  try{
    const { title, description, budget } = req.body;
    const job = new Job({ title, description, budget, postedBy:req.user.id });
    await job.save();
    res.status(201).json(job);
  } catch(err){ res.status(500).json({ message: err.message }); }
};
