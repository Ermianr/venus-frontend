import { redirect } from "next/navigation";
import { authClient } from "./auth";

export async function requireUnauth() {
  const session = await authClient.getSession();

  if (session) {
    redirect("/");
  }
}
