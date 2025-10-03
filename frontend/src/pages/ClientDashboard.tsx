import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Briefcase, Plus, Users, DollarSign, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/lib/api";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "E-commerce Website Development",
      description: "Need a full e-commerce platform with payment integration",
      budget: "$15,000",
      skills: ["React", "Node.js", "Stripe"],
      proposals: 12,
      status: "Active"
    },
    {
      id: 2,
      title: "Mobile App Design",
      description: "Looking for modern UI/UX design for iOS and Android app",
      budget: "$4,000",
      skills: ["Figma", "UI/UX", "Mobile Design"],
      proposals: 8,
      status: "Active"
    }
  ]);

  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    budget: "",
    category: "",
    skills: "",
    deadline: "",
    status: "open"
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const jobs = await api.get<any[]>("/jobs"); // adjust path to backend route if different
        if (mounted) {
          const me = user && (user._id || user.id);
          const mine = (jobs || []).filter((j: any) => {
            const ownerId = j?.postedBy?._id || j?.postedBy;
            return me && ownerId && String(ownerId) === String(me);
          });
          setJobs(mine);
        }
      } catch (err: any) {
        toast.error(err?.message || "Failed to load jobs");
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const jobPayload = {
      title: newJob.title,
      description: newJob.description,
      budget: newJob.budget,
      category: newJob.category,
      skills: newJob.skills,
      deadline: newJob.deadline,
      status: newJob.status,
    };
    try {
      const created = await api.post("/jobs", jobPayload);
      setJobs([created, ...jobs]);
      setNewJob({ title: "", description: "", budget: "", category: "", skills: "", deadline: "", status: "open" });
      setIsDialogOpen(false);
      toast.success("Job posted successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Create failed");
    }
  };

  const handleDeleteJob = async (job: any) => {
    const confirm = window.confirm(`Delete job "${job.title}"? This will remove all related proposals.`);
    if (!confirm) return;
    try {
      await api.del(`/jobs/${job._id || job.id}`);
      setJobs(jobs.filter((j: any) => (j._id || j.id) !== (job._id || job.id)));
      toast.success("Job deleted");
    } catch (err: any) {
      toast.error(err?.message || "Delete failed");
    }
  };

  const [proposalsByJob, setProposalsByJob] = useState<Record<string, any[]>>({});
  const openProposals = async (job: any) => {
    try {
      const list = await api.get<any[]>(`/jobs/${job._id || job.id}/proposals`);
      setProposalsByJob({ ...proposalsByJob, [job._id || job.id]: list || [] });
      toast.success("Loaded proposals");
    } catch (err: any) {
      toast.error(err?.message || "Failed to load proposals");
    }
  };

  // Edit job
  const [editFor, setEditFor] = useState<any | null>(null);
  const [editJob, setEditJob] = useState({ title: "", description: "", budget: "", category: "", skills: "", deadline: "", status: "open" });
  const openEdit = (job: any) => {
    setEditFor(job);
    setEditJob({
      title: job.title || "",
      description: job.description || "",
      budget: String(job.budget ?? ""),
      category: job.category || "",
      skills: Array.isArray(job.skills) ? job.skills.join(", ") : (job.skills || ""),
      deadline: job.deadline ? new Date(job.deadline).toISOString().slice(0,10) : "",
      status: job.status || "open",
    });
  };
  const saveEdit = async () => {
    if (!editFor) return;
    const payload = {
      title: editJob.title,
      description: editJob.description,
      budget: editJob.budget,
      category: editJob.category,
      skills: editJob.skills,
      deadline: editJob.deadline,
      status: editJob.status,
    };
    try {
      const updated = await api.put(`/jobs/${editFor._id || editFor.id}`, payload);
      setJobs(jobs.map((j: any) => ((j._id || j.id) === (editFor._id || editFor.id) ? updated : j)));
      setEditFor(null);
      toast.success("Job updated");
    } catch (err: any) {
      toast.error(err?.message || "Update failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <>
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FreelanceHub
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/research")}>
              Market Insights
            </Button>
            <div className="text-sm text-muted-foreground">
              {user.name || user.email}
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Posted Jobs</h1>
            <p className="text-muted-foreground">Manage your job listings and find talent</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Post New Job
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Post a New Job</DialogTitle>
                <DialogDescription>
                  Fill in the details to attract the best freelancers
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handlePostJob} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Full Stack Developer"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the project requirements..."
                    rows={4}
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    placeholder="e.g., $5,000 - $10,000"
                    value={newJob.budget}
                    onChange={(e) => setNewJob({ ...newJob, budget: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Web Development"
                    value={newJob.category}
                    onChange={(e) => setNewJob({ ...newJob, category: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Required Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    placeholder="e.g., React, Node.js, TypeScript"
                    value={newJob.skills}
                    onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newJob.deadline}
                    onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    className="border rounded h-10 px-3 bg-background"
                    value={newJob.status}
                    onChange={(e) => setNewJob({ ...newJob, status: e.target.value })}
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <Button type="submit" className="w-full">
                  Post Job
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {jobs.length === 0 ? (
          <Card className="p-12 text-center">
            <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No jobs posted yet</h3>
            <p className="text-muted-foreground mb-6">Start by posting your first job to find talented freelancers</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Post Your First Job
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job: any) => (
              <Card key={job._id || job.id} className="hover:shadow-[var(--shadow-elegant)] transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                      <CardDescription className="text-base">{job.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">{job.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        Budget: {job.budget}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {(() => {
                          const jid = job._id || job.id;
                          const loadedCount = Array.isArray(proposalsByJob[jid]) ? proposalsByJob[jid].length : undefined;
                          const baseCount = Array.isArray(job.applicants) ? job.applicants.length : (job.proposals || 0);
                          return (loadedCount !== undefined ? loadedCount : baseCount);
                        })()} Proposals
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(job.skills) ? job.skills : []).map((skill: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2 pt-2 border-t">
                      <Button variant="outline" onClick={() => openProposals(job)}>View Proposals</Button>
                      <Button variant="outline" onClick={() => openEdit(job)}>Edit</Button>
                      <Button variant="destructive" onClick={() => handleDeleteJob(job)}>Delete</Button>
                    </div>
                    {Array.isArray(proposalsByJob[job._id || job.id]) && proposalsByJob[job._id || job.id].length > 0 && (
                      <div className="mt-4 space-y-2">
                        {proposalsByJob[job._id || job.id].map((p: any) => (
                          <div key={p._id} className="rounded border p-3">
                            <div className="text-sm text-muted-foreground mb-1">
                              {p.freelancer?.name || p.freelancer?.email || 'Unknown Freelancer'}
                            </div>
                            <div className="text-sm mb-1">Bid: {p.bidAmount ?? p.amount ?? '-'}</div>
                            <div className="text-sm mb-1">Timeline: {p.timeline ?? p.duration ?? '-'}</div>
                            {(p.contactEmail || p.freelancer?.email) && (
                              <div className="text-sm mb-1">Email: {p.contactEmail || p.freelancer?.email}</div>
                            )}
                            {p.contactPhone && (
                              <div className="text-sm mb-1">Phone: {p.contactPhone}</div>
                            )}
                            <div className="text-sm">{p.coverLetter}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
    {editFor && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-background rounded shadow p-4 w-full max-w-lg max-h-[85vh] overflow-y-auto">
          <div className="text-lg font-semibold mb-3">Edit Job</div>
          <div className="space-y-3">
            <div>
              <Label className="mb-1 block">Title</Label>
              <Input value={editJob.title} onChange={(e)=>setEditJob({ ...editJob, title: e.target.value })} />
            </div>
            <div>
              <Label className="mb-1 block">Description</Label>
              <Textarea rows={4} value={editJob.description} onChange={(e)=>setEditJob({ ...editJob, description: e.target.value })} />
            </div>
            <div>
              <Label className="mb-1 block">Budget</Label>
              <Input value={editJob.budget} onChange={(e)=>setEditJob({ ...editJob, budget: e.target.value })} />
            </div>
            <div>
              <Label className="mb-1 block">Category</Label>
              <Input value={editJob.category} onChange={(e)=>setEditJob({ ...editJob, category: e.target.value })} />
            </div>
            <div>
              <Label className="mb-1 block">Skills (comma-separated)</Label>
              <Input value={editJob.skills} onChange={(e)=>setEditJob({ ...editJob, skills: e.target.value })} />
            </div>
            <div>
              <Label className="mb-1 block">Deadline</Label>
              <Input type="date" value={editJob.deadline} onChange={(e)=>setEditJob({ ...editJob, deadline: e.target.value })} />
            </div>
            <div>
              <Label className="mb-1 block">Status</Label>
              <select className="border rounded h-10 px-3 bg-background" value={editJob.status} onChange={(e)=>setEditJob({ ...editJob, status: e.target.value })}>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={()=>setEditFor(null)}>Cancel</Button>
              <Button onClick={saveEdit}>Save</Button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default ClientDashboard;
