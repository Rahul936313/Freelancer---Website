const express = require('express');
const router = express.Router();
const { getJobs, createJob } = require('../controllers/jobsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getJobs);
router.post('/', authMiddleware, createJob);

module.exports = router;
