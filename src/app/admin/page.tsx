"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  Terminal,
  Shield,
  Cpu,
  Activity,
  LogOut,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Clock,
  Gamepad2,
  Pencil,
  Save,
  Search,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Score {
  id: string;
  playerNumber: number;
  playerName: string;
  totalScore: number;
  distanceTraveled: number;
  survivalTime: number;
  collectiblesCollected: number;
}

interface GameSession {
  id: string;
  sessionId: string;
  player1Pseudo: string | null;
  player2Pseudo: string | null;
  status: string;
  createdAt: string;
  scores: Score[];
}

export default function AdminPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // Redirection si non connecté - AVANT tous les autres hooks
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Early return si pas de session (évite les erreurs de hooks)
  if (isPending) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-[#C0FE04] animate-spin mb-4" />
        <div className="text-[#C0FE04] text-xs tracking-widest animate-pulse">
          CHARGEMENT DU PROTOCOLE ADMIN...
        </div>
      </div>
    );
  }

  if (!session) return null;

  return <AdminPageContent session={session} />;
}

function AdminPageContent({ session }: { session: any }) {
  const router = useRouter();

  // State pour les sessions
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const ITEMS_PER_PAGE = 10;

  // Filter State
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Global Settings State
  const [registrationsOpen, setRegistrationsOpen] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // State pour la suppression
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  // State pour l'édition
  const [editingSession, setEditingSession] = useState<GameSession | null>(
    null,
  );
  const [isUpdatingScore, setIsUpdatingScore] = useState(false);

  // State pour l'UI
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Fetch Global Settings
  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/settings");
      if (response.ok) {
        const data = await response.json();
        setRegistrationsOpen(data.settings.registrationsOpen);
      }
    } catch (error) {
      console.error("Failed to fetch settings");
    } finally {
      setLoadingSettings(false);
    }
  }, []);

  // Toggle Registrations
  const toggleRegistration = async (checked: boolean) => {
    // Optimistic UI update
    setRegistrationsOpen(checked);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationsOpen: checked }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: checked ? "INSCRIPTIONS ACTIVÉES" : "INSCRIPTIONS DÉSACTIVÉES",
        });
      } else {
        setRegistrationsOpen(!checked); // Revert on error
        setMessage({ type: "error", text: "ERREUR LORS DE LA MODIFICATION" });
      }
    } catch (error) {
      setRegistrationsOpen(!checked); // Revert on error
      setMessage({ type: "error", text: "ERREUR RESEAU" });
    }
  };

  // Récupération des sessions
  const fetchSessions = useCallback(
    async (page = 1) => {
      setLoadingSessions(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: ITEMS_PER_PAGE.toString(),
          status: statusFilter,
          search: searchQuery,
        });

        const response = await fetch(
          `/api/admin/sessions?${params.toString()}`,
        );
        if (response.ok) {
          const data = await response.json();
          setSessions(data.sessions);
          setTotalPages(data.pagination.totalPages);
          setTotalItems(data.pagination.total);
          setCurrentPage(data.pagination.page);
        } else {
          setMessage({
            type: "error",
            text: "IMPOSSIBLE DE RECUPERER LES SESSIONS",
          });
        }
      } catch (error) {
        setMessage({ type: "error", text: "ERREUR RESEAU" });
      } finally {
        setLoadingSessions(false);
      }
    },
    [statusFilter, searchQuery],
  );

  // Initial Load
  useEffect(() => {
    if (session) {
      fetchSettings();
      const timer = setTimeout(() => {
        fetchSessions(currentPage);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [session, currentPage, fetchSessions, fetchSettings]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const confirmDelete = async () => {
    if (!sessionToDelete) return;

    setDeletingId(sessionToDelete);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/admin/sessions?id=${sessionToDelete}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        fetchSessions(currentPage);
        setMessage({ type: "success", text: "SESSION PURGEE AVEC SUCCES" });
      } else {
        setMessage({ type: "error", text: "ECHEC DE LA PURGE" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "ERREUR SYSTEME" });
    } finally {
      setDeletingId(null);
      setSessionToDelete(null);
    }
  };

  const handleUpdateScore = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingSession) return;

    setIsUpdatingScore(true);
    try {
      const promises = editingSession.scores.map((score) =>
        fetch("/api/admin/scores", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scoreId: score.id,
            totalScore: score.totalScore,
            distanceTraveled: score.distanceTraveled,
            survivalTime: score.survivalTime,
            collectiblesCollected: score.collectiblesCollected,
          }),
        }),
      );

      await Promise.all(promises);
      setMessage({ type: "success", text: "SCORES MIS À JOUR" });
      setEditingSession(null);
      fetchSessions(currentPage);
    } catch (error) {
      setMessage({
        type: "error",
        text: "ERREUR LORS DE LA MISE À JOUR DES SCORES",
      });
    } finally {
      setIsUpdatingScore(false);
    }
  };

  const updateLocalScore = (
    scoreId: string,
    field: keyof Score,
    value: string | number,
  ) => {
    if (!editingSession) return;
    setEditingSession({
      ...editingSession,
      scores: editingSession.scores.map((s) =>
        s.id === scoreId ? { ...s, [field]: value } : s,
      ),
    });
  };

  const renderPaginationItems = () => {
    const items = [];
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          onClick={() => setCurrentPage(1)}
          isActive={currentPage === 1}
          className={
            currentPage === 1
              ? "bg-[#C0FE04] text-black hover:bg-[#9ACC03]"
              : "text-white hover:text-[#C0FE04] hover:bg-white/10"
          }
        >
          1
        </PaginationLink>
      </PaginationItem>,
    );

    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) endPage = Math.min(totalPages - 1, 4);
    if (currentPage >= totalPages - 2) startPage = Math.max(2, totalPages - 3);

    if (startPage > 2)
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis className="text-white/50" />
        </PaginationItem>,
      );

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => setCurrentPage(i)}
            isActive={currentPage === i}
            className={
              currentPage === i
                ? "bg-[#C0FE04] text-black hover:bg-[#9ACC03]"
                : "text-white hover:text-[#C0FE04] hover:bg-white/10"
            }
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (endPage < totalPages - 1)
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis className="text-white/50" />
        </PaginationItem>,
      );

    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => setCurrentPage(totalPages)}
            isActive={currentPage === totalPages}
            className={
              currentPage === totalPages
                ? "bg-[#C0FE04] text-black hover:bg-[#9ACC03]"
                : "text-white hover:text-[#C0FE04] hover:bg-white/10"
            }
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }
    return items;
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#C0FE04] selection:text-black pb-20">
      <div className="fixed inset-0 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#111_10px,#111_11px)] opacity-20 pointer-events-none z-0"></div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#C0FE04]/10 border border-[#C0FE04] flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#C0FE04]" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white uppercase leading-none">
                Admin <span className="text-[#C0FE04]">Console</span>
              </h1>
              <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase">
                v1.0.4 // SECURE
              </span>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="h-8 text-xs font-mono hidden sm:flex border-red-500/30 text-red-400 hover:text-red-500 hover:border-red-500 hover:bg-red-500/10"
          >
            <LogOut className="w-3 h-3 mr-2" /> DECONNEXION
          </Button>
          <button
            onClick={handleLogout}
            className="sm:hidden p-2 text-red-400 hover:text-red-500"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 p-6 border border-white/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group rounded-lg">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Terminal className="w-16 h-16 text-[#C0FE04]" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-[#C0FE04] rounded-full animate-pulse"></span>
                <span className="text-[#C0FE04] font-mono text-xs tracking-widest uppercase">
                  Opérateur Connecté
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white break-all">
                {session.user.email}
              </h2>
              <div className="mt-4 flex gap-4 text-[10px] font-mono text-white/40">
                <span className="flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> SESSION_ACTIVE
                </span>
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3" /> LATENCY: 24ms
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 border border-white/10 bg-white/5 backdrop-blur-sm relative overflow-hidden rounded-lg flex flex-col justify-center items-center text-center">
            <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase mb-2">
              SESSIONS ACTIVES
            </span>
            <span className="text-4xl font-black text-[#C0FE04] mb-1">
              {totalItems}
            </span>
            <span className="text-[10px] font-mono text-white/30">
              DANS LA BASE DE DONNÉES
            </span>
          </div>
        </div>

        {/* Global Settings */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-lg mb-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-[#C0FE04]" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">
              Configuration Système
            </h3>
          </div>
          <div className="flex items-center justify-between p-4 bg-black/40 border border-white/10 rounded">
            <div className="space-y-1">
              <Label className="text-sm font-mono text-white">
                Inscriptions Utilisateurs
              </Label>
              <p className="text-xs text-white/50">
                Si désactivé, le formulaire d'inscription et le lien seront
                masqués.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-mono uppercase ${registrationsOpen ? "text-[#C0FE04]" : "text-red-500"}`}
              >
                {registrationsOpen ? "OPEN" : "LOCKED"}
              </span>
              <Switch
                checked={registrationsOpen}
                onCheckedChange={toggleRegistration}
                disabled={loadingSettings}
                className="data-[state=checked]:bg-[#C0FE04]"
              />
            </div>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-lg mb-6 flex flex-col md:flex-row gap-4 items-end md:items-center justify-between backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="space-y-1 w-full md:w-64">
              <Label className="text-[10px] font-mono text-white/50 uppercase tracking-widest">
                Rechercher
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  placeholder="ID ou Pseudo..."
                  className="pl-9 bg-black/50 border-white/20 h-9 font-mono text-xs focus:border-[#C0FE04]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1 w-full md:w-48">
              <Label className="text-[10px] font-mono text-white/50 uppercase tracking-widest">
                Statut
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-black/50 border-white/20 h-9 font-mono text-xs focus:ring-0 focus:border-[#C0FE04]">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent className="bg-black border border-white/20 text-white font-mono">
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="waiting" className="text-yellow-500">
                    Waiting
                  </SelectItem>
                  <SelectItem value="playing" className="text-green-500">
                    Playing
                  </SelectItem>
                  <SelectItem value="finished" className="text-white/50">
                    Finished
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={() => fetchSessions(currentPage)}
            variant="outline"
            size="sm"
            className="h-9 w-full md:w-auto text-xs font-mono hover:bg-[#C0FE04]/10 hover:text-[#C0FE04] hover:border-[#C0FE04]"
            disabled={loadingSessions}
          >
            <RefreshCw
              className={`w-3 h-3 mr-2 ${loadingSessions ? "animate-spin" : ""}`}
            />
            ACTUALISER
          </Button>
        </div>

        {/* Sessions List */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-[#C0FE04]" />
              <h3 className="text-xl font-bold uppercase tracking-tight">
                Gestion des Sessions
              </h3>
            </div>
          </div>

          {message && (
            <div
              className={`p-4 border text-xs font-mono flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 ${
                message.type === "success"
                  ? "bg-[#C0FE04]/10 border-[#C0FE04]/50 text-[#C0FE04]"
                  : "bg-red-500/10 border-red-500/50 text-red-500"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              {message.text}
            </div>
          )}

          <div className="border border-white/10 rounded-lg overflow-hidden bg-black/40 backdrop-blur-sm">
            {loadingSessions ? (
              <div className="p-12 flex flex-col items-center justify-center text-white/30 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-xs font-mono uppercase tracking-widest">
                  Récupération des données...
                </span>
              </div>
            ) : sessions.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center text-white/30 space-y-4">
                <Gamepad2 className="w-12 h-12 opacity-50" />
                <span className="text-xs font-mono uppercase tracking-widest">
                  Aucune session trouvée
                </span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-[10px] font-mono uppercase tracking-widest text-white/50">
                      <th className="p-4 font-normal">Session ID</th>
                      <th className="p-4 font-normal">Statut</th>
                      <th className="p-4 font-normal">Joueurs</th>
                      <th className="p-4 font-normal">Scores</th>
                      <th className="p-4 font-normal">Création</th>
                      <th className="p-4 font-normal text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {sessions.map((gameSession) => (
                      <tr
                        key={gameSession.sessionId}
                        className="group hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4 font-mono text-white/70">
                          <span className="text-[#C0FE04] mr-2">#</span>
                          {gameSession.sessionId.substring(0, 8)}...
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wide border ${
                              gameSession.status === "playing"
                                ? "border-green-500/50 text-green-500 bg-green-500/10"
                                : gameSession.status === "waiting"
                                  ? "border-yellow-500/50 text-yellow-500 bg-yellow-500/10"
                                  : "border-white/20 text-white/50 bg-white/5"
                            }`}
                          >
                            {gameSession.status === "playing" && (
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                            )}
                            {gameSession.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-white/40 text-[10px] font-mono">
                                P1
                              </span>
                              {gameSession.player1Pseudo ? (
                                <span className="font-bold text-white">
                                  {gameSession.player1Pseudo}
                                </span>
                              ) : (
                                <span className="text-white/20 italic">
                                  En attente...
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-white/40 text-[10px] font-mono">
                                P2
                              </span>
                              {gameSession.player2Pseudo ? (
                                <span className="font-bold text-white">
                                  {gameSession.player2Pseudo}
                                </span>
                              ) : (
                                <span className="text-white/20 italic">
                                  En attente...
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-xs font-mono text-white/60">
                          {gameSession.scores.length > 0 ? (
                            <div className="flex flex-col gap-1">
                              {gameSession.scores.map((s) => (
                                <div key={s.id}>
                                  P{s.playerNumber}:{" "}
                                  <span className="text-[#C0FE04]">
                                    {s.totalScore}
                                  </span>{" "}
                                  pts
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-white/20">Aucun score</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center text-xs text-white/50">
                            <Clock className="w-3 h-3 mr-1.5" />
                            {formatDistanceToNow(
                              new Date(gameSession.createdAt),
                              { addSuffix: true, locale: fr },
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            {gameSession.scores.length > 0 && (
                              <Button
                                onClick={() => setEditingSession(gameSession)}
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 border-[#C0FE04]/20 text-[#C0FE04] hover:bg-[#C0FE04] hover:text-black hover:border-[#C0FE04] transition-all"
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                            )}
                            <Button
                              onClick={() =>
                                setSessionToDelete(gameSession.sessionId)
                              }
                              disabled={deletingId === gameSession.sessionId}
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                            >
                              {deletingId === gameSession.sessionId ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Trash2 className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50 text-white"
                          : "text-white hover:text-[#C0FE04] cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {renderPaginationItems()}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50 text-white"
                          : "text-white hover:text-[#C0FE04] cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>

        <div className="pt-8 mt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[10px] font-mono text-white/30">
          <span>SYSTEM_ID: ADMIN_DASHBOARD_V1</span>
          <span>LAST_UPDATE: 2026.01.24</span>
        </div>
      </main>

      <AlertDialog
        open={!!sessionToDelete}
        onOpenChange={(open) => !open && setSessionToDelete(null)}
      >
        <AlertDialogContent className="bg-black border border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500 font-bold uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Confirmation de purge
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/60 text-xs font-mono">
              Cette action est irréversible. La session{" "}
              <span className="text-white">
                {sessionToDelete?.substring(0, 8)}...
              </span>{" "}
              ainsi que tous les scores associés seront définitivement supprimés
              de la base de données.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white rounded-none uppercase text-xs font-bold tracking-wider">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 text-white hover:bg-red-600 border-none rounded-none uppercase text-xs font-bold tracking-wider"
            >
              Purger la session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={!!editingSession}
        onOpenChange={(open) => !open && setEditingSession(null)}
      >
        <DialogContent className="bg-black border border-[#C0FE04]/30 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#C0FE04] font-bold uppercase tracking-wider flex items-center gap-2">
              <Pencil className="w-5 h-5" /> Modification des Scores
            </DialogTitle>
            <DialogDescription className="text-white/60 text-xs font-mono">
              Modification manuelle des données de la session #
              {editingSession?.sessionId.substring(0, 8)}...
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateScore} className="space-y-6 py-4">
            {editingSession?.scores.map((score, index) => (
              <div
                key={score.id}
                className="space-y-4 p-4 border border-white/10 bg-white/5 rounded"
              >
                <div className="flex items-center gap-2 text-sm font-bold uppercase text-[#C0FE04]">
                  <span className="w-2 h-2 bg-[#C0FE04] rounded-full"></span>{" "}
                  Joueur {score.playerNumber} ({score.playerName})
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor={`score-${score.id}`}
                      className="text-[10px] font-mono text-white/50 uppercase"
                    >
                      Score Total
                    </Label>
                    <Input
                      id={`score-${score.id}`}
                      type="number"
                      value={score.totalScore}
                      onChange={(e) =>
                        updateLocalScore(
                          score.id,
                          "totalScore",
                          parseInt(e.target.value),
                        )
                      }
                      className="bg-black/50 border-white/20 text-white font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor={`dist-${score.id}`}
                      className="text-[10px] font-mono text-white/50 uppercase"
                    >
                      Distance (m)
                    </Label>
                    <Input
                      id={`dist-${score.id}`}
                      type="number"
                      step="0.1"
                      value={score.distanceTraveled}
                      onChange={(e) =>
                        updateLocalScore(
                          score.id,
                          "distanceTraveled",
                          parseFloat(e.target.value),
                        )
                      }
                      className="bg-black/50 border-white/20 text-white font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor={`time-${score.id}`}
                      className="text-[10px] font-mono text-white/50 uppercase"
                    >
                      Survie (sec)
                    </Label>
                    <Input
                      id={`time-${score.id}`}
                      type="number"
                      step="0.1"
                      value={score.survivalTime}
                      onChange={(e) =>
                        updateLocalScore(
                          score.id,
                          "survivalTime",
                          parseFloat(e.target.value),
                        )
                      }
                      className="bg-black/50 border-white/20 text-white font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor={`coll-${score.id}`}
                      className="text-[10px] font-mono text-white/50 uppercase"
                    >
                      Collectibles
                    </Label>
                    <Input
                      id={`coll-${score.id}`}
                      type="number"
                      value={score.collectiblesCollected}
                      onChange={(e) =>
                        updateLocalScore(
                          score.id,
                          "collectiblesCollected",
                          parseInt(e.target.value),
                        )
                      }
                      className="bg-black/50 border-white/20 text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditingSession(null)}
                className="uppercase text-xs font-bold"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isUpdatingScore}
                className="bg-[#C0FE04] text-black hover:bg-[#9ACC03] uppercase text-xs font-bold tracking-wider"
              >
                {isUpdatingScore ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" /> Enregistrer
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
