const Job = require('../models/Job');

exports.getJobs = async (req, res) => {
  console.log("[JOBS GET] req.user:", req.user && req.user.id);
  try {
    const jobs = await Job.find().populate('postedBy', 'name');
    res.json(jobs);
  } catch (err) {
    console.error("[JOBS GET ERROR]", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.createJob = async (req, res) => {
  console.log("[JOBS CREATE] body:", req.body, "req.user:", req.user && req.user.id);
  try {
    // ensure authenticated user present
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized - missing user" });
    }

    // sanitize/parse budget to number (accept strings like "$5,000" or "5000")
    let { title, description, budget, category, skills, deadline, status } = req.body;
    if (typeof budget === "string") {
      // remove currency symbols, commas and whitespace
      const cleaned = String(budget).replace(/[^0-9.\-]/g, "");
      const parsed = Number(cleaned);
      if (Number.isNaN(parsed)) {
        return res.status(400).json({ message: "Invalid budget value" });
      }
      budget = parsed;
    }

    // normalize skills to array of strings
    if (typeof skills === 'string') {
      skills = skills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    // coerce deadline to Date if provided
    if (deadline) {
      const d = new Date(deadline);
      if (isNaN(d.getTime())) return res.status(400).json({ message: 'Invalid deadline date' });
      deadline = d;
    }

    // final validation
    if (!title || !description || budget === undefined) {
      return res.status(400).json({ message: "title, description and budget are required" });
    }

    const job = new Job({
      title,
      description,
      budget,
      category: category || '',
      skills: Array.isArray(skills) ? skills : [],
      deadline: deadline || undefined,
      status: status === 'closed' ? 'closed' : 'open',
      postedBy: req.user.id,
    });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    console.error("[JOBS CREATE ERROR]", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// Update a job (only owner)
exports.updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized - missing user' });
    }
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (String(job.postedBy) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    let { title, description, budget, category, skills, deadline, status } = req.body;
    if (typeof budget === 'string') {
      const cleaned = String(budget).replace(/[^0-9.\-]/g, '');
      const parsed = Number(cleaned);
      if (Number.isNaN(parsed)) return res.status(400).json({ message: 'Invalid budget value' });
      budget = parsed;
    }
    if (typeof skills === 'string') {
      skills = skills.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (deadline) {
      const d = new Date(deadline);
      if (isNaN(d.getTime())) return res.status(400).json({ message: 'Invalid deadline date' });
      deadline = d;
    }

    if (title !== undefined) job.title = title;
    if (description !== undefined) job.description = description;
    if (budget !== undefined) job.budget = budget;
    if (category !== undefined) job.category = category;
    if (skills !== undefined) job.skills = Array.isArray(skills) ? skills : [];
    if (deadline !== undefined) job.deadline = deadline;
    if (status !== undefined) job.status = status === 'closed' ? 'closed' : 'open';

    await job.save();
    return res.json(job);
  } catch (err) {
    console.error('[JOBS UPDATE ERROR]', err);
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};

// Delete a job and cascade delete proposals
exports.deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized - missing user' });
    }
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (String(job.postedBy) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    // remove proposals referencing this job
    const Proposal = require('../models/Proposal');
    await Proposal.deleteMany({ job: jobId });
    await job.deleteOne();
    return res.json({ message: 'Job and related proposals deleted' });
  } catch (err) {
    console.error('[JOBS DELETE ERROR]', err);
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};
