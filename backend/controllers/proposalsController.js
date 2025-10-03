const Proposal = require("../models/Proposal");
const Job = require("../models/Job");

// Create a new proposal for a job (POST /api/jobs/:jobId/proposals)
const createProposal = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized - missing user' });
    }
    const jobId = req.params.jobId || req.body.jobId;
    if (!jobId) return res.status(400).json({ message: "jobId is required" });

    const { freelancer, coverLetter, bidAmount, timeline, status, contactEmail, contactPhone } = req.body;

    const proposal = new Proposal({
      job: jobId,
      freelancer: freelancer || req.user.id,
      coverLetter: coverLetter || "",
      bidAmount: typeof bidAmount === 'string' ? Number(String(bidAmount).replace(/[^0-9.\-]/g, '')) : (bidAmount || 0),
      timeline: timeline || "",
      status: status || "pending",
      contactEmail: contactEmail || '',
      contactPhone: contactPhone || '',
    });

    await proposal.save();

    // increment applicants list on the job for quick counts
    try {
      const job = await Job.findById(jobId);
      if (job) {
        if (!Array.isArray(job.applicants)) job.applicants = [];
        if (!job.applicants.find((id) => String(id) === String(proposal.freelancer))) {
          job.applicants.push(proposal.freelancer);
          await job.save();
        }
      }
    } catch (e) {
      console.warn('Failed to update job applicants count:', e?.message);
    }

    return res.status(201).json({ proposal });
  } catch (error) {
    console.error("createProposal error:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// Get proposals for a specific job (GET /api/jobs/:jobId/proposals)
const getProposalsByJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    if (!jobId) return res.status(400).json({ message: "jobId is required" });

    const proposals = await Proposal.find({ job: jobId })
      .populate('freelancer', 'name email')
      .sort({ createdAt: -1 });
    return res.json(proposals);
  } catch (error) {
    console.error("getProposalsByJob error:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// Get a single proposal by id (GET /api/proposals/:id)
const getProposalById = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) return res.status(404).json({ message: "Proposal not found" });
    return res.json(proposal);
  } catch (error) {
    console.error("getProposalById error:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// Delete a proposal (DELETE /api/proposals/:id)
const deleteProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findByIdAndDelete(req.params.id);
    if (!proposal) return res.status(404).json({ message: "Proposal not found" });
    return res.json({ message: "Proposal deleted" });
  } catch (error) {
    console.error("deleteProposal error:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = {
  createProposal,
  getProposalsByJob,
  getProposalById,
  deleteProposal,
};