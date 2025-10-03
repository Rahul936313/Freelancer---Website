const express = require('express');
const router = express.Router();
const { getJobs, createJob, deleteJob, updateJob } = require('../controllers/jobsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getJobs);
router.post('/', authMiddleware, createJob);
router.put('/:id', authMiddleware, updateJob);
router.delete('/:id', authMiddleware, deleteJob);

module.exports = router;
