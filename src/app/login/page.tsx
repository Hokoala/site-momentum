"use client";

import { useState, useEffect } from "react";
import { signIn, signUp, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowRight, Loader2, Shield, AlertTriangle, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registrationsOpen, setRegistrationsOpen] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();

  // Si déjà connecté, rediriger
  if (session) {
    router.push("/admin");
    return null;
  }

  useEffect(() => {
    // Vérifier si les inscriptions sont ouvertes
    fetch("/api/config")
      .then(res => res.json())
      .then(data => {
        setRegistrationsOpen(data.registrationsOpen);
        if (!data.registrationsOpen) {
          setIsSignUp(false);
        }
      })
      .catch(err => console.error("Erreur config:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        if (!registrationsOpen) {
          setError("Les inscriptions sont actuellement fermées.");
          setLoading(false);
          return;
        }

        // Inscription
        const result = await signUp.email({
          email,
          password,
          name,
        });

        if (result.error) {
          setError(result.error.message || "Erreur lors de l'inscription");
        } else {
          router.push("/admin");
        }
      } else {
        // Connexion
        const result = await signIn.email({
          email,
          password,
        });

        if (result.error) {
          setError(result.error.message || "Erreur lors de la connexion");
        } else {
          router.push("/admin");
        }
      }
    } catch (err) {
      setError("Une erreur est survenue");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#C0FE04] selection:text-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#111_10px,#111_11px)] opacity-20 pointer-events-none"></div>
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#C0FE04]/5 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#C0FE04]/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header Logo Area */}
        <div className="mb-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-[#C0FE04]/10 border border-[#C0FE04] flex items-center justify-center mb-4 group relative">
                <Shield className="w-8 h-8 text-[#C0FE04] group-hover:scale-110 transition-transform" />
                <div className="absolute -inset-1 border border-[#C0FE04]/30 scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
                Momentum <span className="text-[#C0FE04]">Access</span>
            </h1>
            <p className="text-[#C0FE04] text-[10px] font-mono tracking-[0.2em] uppercase mt-2 animate-pulse">
                Secure Authentication Protocol
            </p>
        </div>

        {/* Auth Card */}
        <div className="bg-black/80 backdrop-blur-md border border-white/10 p-8 relative group">
            {/* Corner Decorations */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#C0FE04]"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#C0FE04]"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#C0FE04]"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#C0FE04]"></div>

            <div className="mb-6 flex justify-between items-center border-b border-white/10 pb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                    {isSignUp ? "Initialisation Compte" : "Identification"}
                </h2>
                <div className="flex gap-1">
                    <div className="w-1 h-1 bg-[#C0FE04] rounded-full"></div>
                    <div className="w-1 h-1 bg-[#C0FE04]/50 rounded-full"></div>
                    <div className="w-1 h-1 bg-[#C0FE04]/20 rounded-full"></div>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 mb-6 flex items-center gap-3 text-xs font-mono">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    {error}
                </div>
            )}
            
            {!registrationsOpen && !isSignUp && (
                 <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 p-2 mb-6 text-[10px] font-mono uppercase tracking-wide flex items-center justify-center gap-2">
                    <LockKeyhole className="w-3 h-3" /> Inscriptions système verrouillées
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {isSignUp && (
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-[10px] font-mono text-white/50 uppercase tracking-widest pl-1">
                            Identifiant
                        </label>
                        <div className="relative group/input">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within/input:text-[#C0FE04] transition-colors" />
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-10 bg-black/50 border-white/20 h-10 font-mono text-sm focus:border-[#C0FE04]"
                                placeholder="PSEUDO..."
                                required={isSignUp}
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <label htmlFor="email" className="text-[10px] font-mono text-white/50 uppercase tracking-widest pl-1">
                        Adresse Email
                    </label>
                    <div className="relative group/input">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within/input:text-[#C0FE04] transition-colors" />
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 bg-black/50 border-white/20 h-10 font-mono text-sm focus:border-[#C0FE04]"
                            placeholder="USER@MOMENTUM.COM"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="text-[10px] font-mono text-white/50 uppercase tracking-widest pl-1">
                        Clé de sécurité
                    </label>
                    <div className="relative group/input">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within/input:text-[#C0FE04] transition-colors" />
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 bg-black/50 border-white/20 h-10 font-mono text-sm focus:border-[#C0FE04]"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 mt-4 bg-[#C0FE04] text-black hover:bg-[#9ACC03] font-bold uppercase tracking-wider text-xs border border-transparent hover:border-white/50 transition-all group/btn relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative flex items-center gap-2">
                        {loading ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> TRAITEMENT...</>
                        ) : (
                            <>{isSignUp ? "Initier Protocole" : "Connexion Système"} <ArrowRight className="w-4 h-4" /></>
                        )}
                    </span>
                </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
                {registrationsOpen ? (
                    <button
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError("");
                        }}
                        className="text-white/50 hover:text-[#C0FE04] text-xs font-mono uppercase tracking-widest transition-colors"
                    >
                        {isSignUp
                            ? ">> Retour à l'identification"
                            : ">> Créer un nouvel accès"}
                    </button>
                ) : (
                    <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest cursor-not-allowed">
                        // Accès restreint au personnel autorisé
                    </p>
                )}
            </div>
        </div>

        <div className="mt-8 flex justify-between text-[10px] font-mono text-white/20 uppercase">
            <span>System Status: ONLINE</span>
            <span>V.2.0.4</span>
        </div>
      </div>
    </div>
  );
}