const express = require('express');
const router = express.Router();
const { applyJob } = require('../controllers/proposalsController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/apply', authMiddleware, applyJob);

module.exports = router;
