const Research = require('../models/Research');

exports.getResearch = async (req,res)=>{
  try{
    const data = await Research.find();
    res.json(data);
  } catch(err){ res.status(500).json({ message: err.message }); }
};
