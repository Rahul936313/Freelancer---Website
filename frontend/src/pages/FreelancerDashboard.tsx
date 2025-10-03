import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, DollarSign, MapPin, Clock, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/lib/api";

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Full Stack Developer Needed",
      description: "Looking for an experienced developer to build a modern web application with React and Node.js",
      budget: "$5,000 - $10,000",
      duration: "2-3 months",
      location: "Remote",
      skills: ["React", "Node.js", "TypeScript", "MongoDB"],
      postedBy: "Tech Startup Inc.",
      postedDate: "2 days ago"
    },
    {
      id: 2,
      title: "UI/UX Designer for Mobile App",
      description: "Need a creative designer to redesign our mobile application interface",
      budget: "$3,000 - $5,000",
      duration: "1 month",
      location: "Remote",
      skills: ["Figma", "UI Design", "Mobile Design", "Prototyping"],
      postedBy: "FinTech Solutions",
      postedDate: "1 week ago"
    },
    {
      id: 3,
      title: "Content Writer - Technology Blog",
      description: "Seeking a talented writer to create engaging content for our tech blog",
      budget: "$500 - $1,000",
      duration: "Ongoing",
      location: "Remote",
      skills: ["Content Writing", "SEO", "Technology", "Research"],
      postedBy: "Digital Media Co.",
      postedDate: "3 days ago"
    },
    {
      id: 4,
      title: "Python Data Analyst",
      description: "Analyze large datasets and create insightful visualizations for business intelligence",
      budget: "$4,000 - $7,000",
      duration: "2 months",
      location: "Remote",
      skills: ["Python", "Pandas", "Data Visualization", "SQL"],
      postedBy: "Analytics Corp",
      postedDate: "5 days ago"
    }
  ]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const jobs = await api.get<any[]>("/jobs"); // adjust if backend path differs
        if (mounted) setJobs(jobs || []);
      } catch (err: any) {
        toast.error(err?.message || "Failed to load jobs");
      }
    })();
    return () => { mounted = false; };
  }, []);

  // submit proposal
  const submitProposal = async (jobId: string, data: any) => {
    try {
      await api.post(`/jobs/${jobId}/proposals`, data);
      toast.success("Proposal submitted");
    } catch (err: any) {
      toast.error(err?.message || "Proposal failed");
    }
  };

  const [applyFor, setApplyFor] = useState<any | null>(null);
  const [proposal, setProposal] = useState({ coverLetter: "", bidAmount: "", timeline: "", contactEmail: "", contactPhone: "" });
  const handleApply = (job: any) => {
    setApplyFor(job);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Available Jobs</h1>
          <p className="text-muted-foreground">Find your next opportunity</p>
        </div>

        <div className="grid gap-6">
          {jobs.map((job: any) => (
            <Card key={job._id || job.id} className="hover:shadow-[var(--shadow-elegant)] transition-all">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                    <CardDescription className="text-base">{job.description}</CardDescription>
                  </div>
                  <Button onClick={() => handleApply(job)}>
                    Apply Now
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {job.budget}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {job.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(job.skills) ? job.skills : []).map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="text-sm">
                      Posted by <span className="font-medium">{job.postedBy?.name || job.postedBy || "Unknown"}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{job.postedDate || (job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "")}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {applyFor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded shadow p-4 w-full max-w-md">
            <div className="text-lg font-semibold mb-2">Apply to {applyFor.title}</div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Cover Letter</label>
                <textarea className="w-full border rounded p-2" rows={4}
                  value={proposal.coverLetter}
                  onChange={(e) => setProposal({ ...proposal, coverLetter: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Bid Amount</label>
                <input className="w-full border rounded h-10 px-2"
                  value={proposal.bidAmount}
                  onChange={(e) => setProposal({ ...proposal, bidAmount: e.target.value })}
                  placeholder="e.g., 5000"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Timeline</label>
                <input className="w-full border rounded h-10 px-2"
                  value={proposal.timeline}
                  onChange={(e) => setProposal({ ...proposal, timeline: e.target.value })}
                  placeholder="e.g., 2 months"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Contact Email</label>
                <input className="w-full border rounded h-10 px-2"
                  type="email"
                  value={proposal.contactEmail}
                  onChange={(e) => setProposal({ ...proposal, contactEmail: e.target.value })}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Contact Phone</label>
                <input className="w-full border rounded h-10 px-2"
                  value={proposal.contactPhone}
                  onChange={(e) => setProposal({ ...proposal, contactPhone: e.target.value })}
                  placeholder="e.g., +1 555 123 4567"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setApplyFor(null)}>Cancel</Button>
                <Button onClick={async () => {
                  await submitProposal(applyFor._id || applyFor.id, proposal);
                  setApplyFor(null);
                  setProposal({ coverLetter: "", bidAmount: "", timeline: "", contactEmail: "", contactPhone: "" });
                }}>Submit</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreelancerDashboard;
