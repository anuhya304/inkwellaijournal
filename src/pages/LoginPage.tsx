import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PenLine, LogIn, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import InkSplatter from "@/components/InkSplatter";
import BackgroundElements from "@/components/BackgroundElements";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (login(username, password)) {
      navigate("/");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      <InkSplatter className="-top-20 -right-20 text-primary w-[300px] h-[300px]" />
      <InkSplatter className="-bottom-32 -left-16 text-ink-blue w-[250px] h-[250px]" />
      <BackgroundElements />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <PenLine className="w-6 h-6 text-primary" />
            <h1 className="font-display text-3xl font-bold text-gradient-amber tracking-tight">
              Inkwell
            </h1>
          </div>
          <p className="font-mono text-xs text-muted-foreground tracking-[0.2em] uppercase">
            Sign in to your journal
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-xl p-8 shadow-ink space-y-5"
        >
          <div className="space-y-2">
            <label className="font-mono text-xs text-muted-foreground tracking-wider uppercase">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground font-body focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary/40 transition-all"
              placeholder="Enter username"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="font-mono text-xs text-muted-foreground tracking-wider uppercase">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground font-body focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary/40 transition-all"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-destructive font-mono text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground font-mono text-sm tracking-wide hover:bg-amber-glow transition-all shadow-amber"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
