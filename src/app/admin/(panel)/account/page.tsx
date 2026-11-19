import { requireAdmin } from "@/lib/auth";
import { logoutEverywhere } from "../../actions";
import AccountForms from "./AccountForms";

export default async function Account() {
  const admin = await requireAdmin();
  return (
    <>
      <div className="a-top">
        <div>
          <div className="a-crumb">Account</div>
          <h1>My password & email</h1>
          <p>Update your sign-in email and password. For safety you are signed out automatically after 8 hours without activity, and after 7 days in any case.</p>
        </div>
      </div>
      <AccountForms name={admin.name} email={admin.email} />
      <div className="a-card">
        <div className="a-card-head">
          <div>
            <h2>Sign out on all devices</h2>
            <p>Use this if you signed in on a shared or lost computer or phone. Every device, including this one, will need to sign in again. Changing your password does this automatically for other devices.</p>
          </div>
        </div>
        <form action={logoutEverywhere}>
          <button suppressHydrationWarning className="a-btn danger">Sign out everywhere</button>
        </form>
      </div>
    </>
  );
}
