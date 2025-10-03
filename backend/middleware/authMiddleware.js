const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
  const token = req.headers.authorization?.split(" ")[1];
  if(!token) return res.status(401).json({ message: "No token" });
  try{
    const jwtSecret = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? undefined : 'secret');
    if (!jwtSecret) return res.status(500).json({ message: 'Server misconfiguration' });
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch(err){
    res.status(401).json({ message: "Invalid token" });
  }
};
