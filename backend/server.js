require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');

const app = express();

// enforce critical env in production
if (process.env.NODE_ENV === 'production') {
  if (!process.env.MONGO_URI) {
    console.error('Missing MONGO_URI in production. Aborting startup.');
    process.exit(1);
  }
  if (!process.env.JWT_SECRET) {
    console.error('Missing JWT_SECRET in production. Aborting startup.');
    process.exit(1);
  }
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

connectDB();

// parse JSON bodies
app.use(express.json());

const allowedOrigins = [
  // Vite/React dev servers (common ports)
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://localhost:8081",
  "http://127.0.0.1:8081",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  // LAN IP examples (customize as needed)
  "http://192.168.0.1:8080",
  "http://192.168.0.1:8081",
  "http://192.168.0.1:5173"
];

// allow requests from specific dev origins and allow cookies
const corsOptions = {
  origin: (origin, callback) => {
    // allow non-browser tools / same-origin requests (origin may be undefined)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("CORS policy: origin not allowed"), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// enable CORS and handle preflight for all routes
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// mount routes under /api
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const researchRoutes = require("./routes/researchRoutes");
const proposalRoutes = require("./routes/proposalRoutes");

// auth endpoints -> /api/auth/...
// add a tiny logger to show incoming body/headers for debugging
app.use(
  "/api/auth",
  (req, res, next) => {
    console.log("[AUTH ROUTE] %s %s - headers:", req.method, req.originalUrl, {
      origin: req.headers.origin,
      "content-type": req.headers["content-type"],
    });
    console.log("[AUTH ROUTE] body:", req.body);
    next();
  },
  authRoutes
);

// job endpoints -> /api/jobs/...
app.use(
  "/api/jobs",
  (req, res, next) => {
    console.log("[JOBS ROUTE] %s %s", req.method, req.originalUrl);
    console.log("[JOBS ROUTE] headers:", {
      origin: req.headers.origin,
      "content-type": req.headers["content-type"],
      authorization: req.headers.authorization,
    });
    console.log("[JOBS ROUTE] body:", req.body);
    next();
  },
  jobRoutes
);

// proposal endpoints are nested under jobs
app.use("/api/jobs", proposalRoutes);

// research endpoints -> /api/research/...
app.use("/api/research", researchRoutes);

// Basic routes
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Global error handler (returns JSON & logs stack)
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR HANDLER:", err && err.stack ? err.stack : err);
  if (res.headersSent) return next(err);
  res.status(err && err.status ? err.status : 500).json({
    message: err && err.message ? err.message : "Internal Server Error",
  });
});

// Handle unhandled rejections/uncaught exceptions in dev
process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled Rejection at:", p, "reason:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;
