import { cookies } from "next/headers";

export async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_auth")?.value === "1";
}

export async function requireAdmin() {
  const ok = await isAdmin();
  if (!ok) {
    throw new Error("UNAUTHORIZED");
  }
}
