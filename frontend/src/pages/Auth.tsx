import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Briefcase } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "login";
  
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [userRole, setUserRole] = useState<"freelancer" | "client">("freelancer");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // trim inputs before sending
    const payload = {
      email: (loginEmail || "").trim(),
      password: (loginPassword || ""), // don't auto-trim password characters intentionally, but remove accidental trailing spaces if desired
    };
    console.log("[FRONTEND LOGIN] payload (email, pwdLen):", payload.email, payload.password.length);

    try {
      const res = await api.post<{ token?: string; user?: any }>("/auth/login", payload);
      if (res?.token) localStorage.setItem("token", res.token);
      if (res?.user) localStorage.setItem("user", JSON.stringify(res.user));
      toast.success("Welcome back!");
      const role = res?.user?.role;
      navigate(role === "client" ? "/client-dashboard" : "/freelancer-dashboard");
    } catch (err: any) {
      console.error("[FRONTEND LOGIN ERROR]", err);
      toast.error(err?.message || "Login failed");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // trim inputs before sending
    const payload = {
      name: (signupName || "").trim(),
      email: (signupEmail || "").trim().toLowerCase(),
      password: (signupPassword || ""),
      role: userRole,
    };
    console.log("[FRONTEND SIGNUP] payload (email, name, pwdLen):", payload.email, payload.name, payload.password.length);

    try {
      const created = await api.post<{ user?: any }>("/auth/signup", payload);
      if (created?.user) localStorage.setItem("user", JSON.stringify(created.user));
      toast.success("Account created successfully!");
      navigate(userRole === "freelancer" ? "/freelancer-dashboard" : "/client-dashboard");
    } catch (err: any) {
      console.error("[FRONTEND SIGNUP ERROR]", err);
      toast.error(err?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Briefcase className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FreelanceHub
            </span>
          </div>
          <p className="text-muted-foreground">Your gateway to freelance success</p>
        </div>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Sign in to your account to continue</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Join FreelanceHub today</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>I want to:</Label>
                    <RadioGroup value={userRole} onValueChange={(value) => setUserRole(value as "freelancer" | "client")}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="freelancer" id="freelancer" />
                        <Label htmlFor="freelancer" className="font-normal cursor-pointer">
                          Find work as a Freelancer
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="client" id="client" />
                        <Label htmlFor="client" className="font-normal cursor-pointer">
                          Hire talent as a Client
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
