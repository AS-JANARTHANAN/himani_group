import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "./db";
import { SESSION_COOKIE, cookieOptions, signSession, verifySession } from "./session";

/** The signed-in admin, or null. Checks the token AND that it has not been cancelled (session version). */
export const getAdmin = cache(async () => {
  const jar = await cookies();
  const s = await verifySession(jar.get(SESSION_COOKIE)?.value);
  if (!s) return null;
  const user = await db.adminUser.findUnique({ where: { id: s.uid }, select: { id: true, email: true, name: true, sessionVersion: true } });
  if (!user || user.sessionVersion !== s.ver) return null;
  return { id: user.id, email: user.email, name: user.name };
});

/** Call at the top of every admin page and server action. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function startSession(user: { id: string; email: string; sessionVersion: number }) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, await signSession({ uid: user.id, email: user.email, ver: user.sessionVersion }), cookieOptions());
}

export async function endSession() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", { ...cookieOptions(0), maxAge: 0 });
}

/** Cancels every existing login for this user (all devices). */
export async function revokeAllSessions(userId: string) {
  return db.adminUser.update({ where: { id: userId }, data: { sessionVersion: { increment: 1 } } });
}
