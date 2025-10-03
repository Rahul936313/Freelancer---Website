const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  console.log("[AUTH SIGNUP] body:", req.body);
  console.log("[AUTH SIGNUP] incoming password length:", req.body && req.body.password ? String(req.body.password).length : 0);
  try {
    // normalize email
    let { name, email, password, role } = req.body;
    email = (email || "").trim().toLowerCase();

    // basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "name, email, password and role are required" });
    }

    // check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashed, role });
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({ message: "User created", user: userObj });
  } catch (err) {
    console.error("[AUTH SIGNUP ERROR]", err);
    if (err && err.code === 11000) {
      return res.status(400).json({ message: "Email already in use" });
    }
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.login = async (req, res) => {
  console.log("[AUTH LOGIN] body:", req.body);
  console.log("[AUTH LOGIN] incoming password length:", req.body && req.body.password ? String(req.body.password).length : 0);
  try {
    let { email, password } = req.body;
    email = (email || "").trim().toLowerCase();

    if (!email || !password) return res.status(400).json({ message: "email and password required" });

    const user = await User.findOne({ email });
    if (!user) {
      console.log("[AUTH LOGIN] user not found for email:", email);
      return res.status(400).json({ message: "User not found" });
    }

    // debug: log hash length (do NOT commit logs in production)
    console.log("[AUTH LOGIN] stored hash length:", user.password ? user.password.length : null);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("[AUTH LOGIN] bcrypt.compare result:", isMatch);

    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const jwtSecret = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? undefined : 'secret');
    if (!jwtSecret) {
      return res.status(500).json({ message: 'Server misconfiguration: missing JWT secret' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '1d' });

    const userObj = user.toObject();
    delete userObj.password;

    res.json({ token, user: userObj });
  } catch (err) {
    console.error("[AUTH LOGIN ERROR]", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
