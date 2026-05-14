import { redirect } from "next/navigation";

// The multiplayer entry point is now /game/join (single page for both create
// and join). Keep this redirect so old links keep working.
export default function LobbyRedirect() {
  redirect("/game/join");
}
