import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Briefcase, Users, TrendingUp, Shield, Zap, Award } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Briefcase,
      title: "Find Quality Projects",
      description: "Access thousands of projects from verified clients worldwide"
    },
    {
      icon: Users,
      title: "Hire Top Talent",
      description: "Connect with skilled freelancers ready to bring your vision to life"
    },
    {
      icon: TrendingUp,
      title: "Market Insights",
      description: "Stay ahead with real-time analytics and industry trends"
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Protected transactions with milestone-based payments"
    },
    {
      icon: Zap,
      title: "Fast Matching",
      description: "AI-powered matching system connects you with the right opportunities"
    },
    {
      icon: Award,
      title: "Build Reputation",
      description: "Grow your portfolio and earn recognition for quality work"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FreelanceHub
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/auth?tab=signup")}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[image:var(--gradient-hero)] opacity-50" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Connect, Collaborate,{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Create Success
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              The modern platform where talented freelancers meet visionary clients. 
              Built for the future of work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" onClick={() => navigate("/auth?tab=signup")} className="text-lg">
                Start as Freelancer
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/auth?tab=signup")}>
                Hire Talent
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate("/research")}>
                View Market Insights
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose FreelanceHub?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to succeed in the modern freelance economy
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:-translate-y-1">
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-accent py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Active Freelancers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">5,000+</div>
              <div className="text-muted-foreground">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="p-12 text-center bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals already thriving on FreelanceHub
          </p>
          <Button size="lg" onClick={() => navigate("/auth?tab=signup")} className="text-lg">
            Create Your Free Account
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 FreelanceHub. Building the future of work.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
