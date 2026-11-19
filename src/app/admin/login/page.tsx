import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/content";
import LoginForm from "./LoginForm";
import "../admin.css";

export const metadata: Metadata = { title: "Sign in | Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Login() {
  if (await getAdmin()) redirect("/admin");
  const s = await getSettings();
  return (
    <div className="login-wrap">
      <div className="login-art">
        <img src="/media/stock/hero-excavator.webp" alt="" />
      </div>
      <div className="login-box">
        <div className="login-card">
          {s.brand.logo ? <img src={s.brand.logo} alt="" /> : null}
          <h1>Website editor</h1>
          <p>Sign in to manage the {s.brand.name} website.</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
