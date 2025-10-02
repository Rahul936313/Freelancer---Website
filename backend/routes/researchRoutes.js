const express = require('express');
const router = express.Router();
const { getResearch } = require('../controllers/researchController');

router.get('/', getResearch);

module.exports = router;
