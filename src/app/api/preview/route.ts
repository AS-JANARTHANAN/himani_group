import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";

/** Turns on preview (draft) mode for a signed-in admin and opens the requested page. */
export async function GET(req: Request) {
  if (!(await getAdmin())) return new Response("Unauthorized", { status: 401 });
  const url = new URL(req.url);
  const path = url.searchParams.get("path") || "/";
  const safe = path.startsWith("/") && !path.startsWith("//") ? path : "/";
  (await draftMode()).enable();
  return NextResponse.redirect(new URL(safe, url.origin));
}
