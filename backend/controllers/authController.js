const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req,res)=>{
  try{
    const { name,email,password,role } = req.body;
    const user = new User({name,email,password,role});
    await user.save();
    res.status(201).json({ message:"User created", user });
  } catch(err){ res.status(400).json({ message: err.message }); }
};

exports.login = async (req,res)=>{
  try{
    const { email,password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ message:"User not found" });
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch) return res.status(400).json({ message:"Invalid credentials" });
    const token = jwt.sign({ id:user._id, role:user.role }, process.env.JWT_SECRET, { expiresIn:'1d' });
    res.json({ token, user });
  } catch(err){ res.status(500).json({ message: err.message }); }
};
