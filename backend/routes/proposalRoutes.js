const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

// require controllers exported from controllers/proposalsController.js
const {
  createProposal,
  getProposalsByJob,
  getProposalById,
  deleteProposal,
} = require("../controllers/proposalsController");

// sanity checks to surface missing handler issues early
if (typeof createProposal !== "function") {
  throw new Error("createProposal handler is not defined in controllers/proposalsController.js");
}
if (typeof getProposalsByJob !== "function") {
  throw new Error("getProposalsByJob handler is not defined in controllers/proposalsController.js");
}
if (typeof getProposalById !== "function") {
  throw new Error("getProposalById handler is not defined in controllers/proposalsController.js");
}
if (typeof deleteProposal !== "function") {
  throw new Error("deleteProposal handler is not defined in controllers/proposalsController.js");
}

// Routes (this file is mounted at app.use('/api/jobs', proposalRoutes) in server.js)
// Create proposal for a job -> POST /api/jobs/:jobId/proposals
router.post("/:jobId/proposals", auth, createProposal);

// Get all proposals for a job -> GET /api/jobs/:jobId/proposals
router.get("/:jobId/proposals", getProposalsByJob);

// Get a single proposal by id -> GET /api/jobs/proposals/:id
router.get("/proposals/:id", getProposalById);

// Delete a proposal by id -> DELETE /api/jobs/proposals/:id
router.delete("/proposals/:id", deleteProposal);

module.exports = router;
