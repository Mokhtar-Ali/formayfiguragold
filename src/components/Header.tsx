import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getT } from "@/lib/lang";
import { Logo } from "./Logo";
import { LangSwitch } from "./LangSwitch";
import { Bell, LogoutButton, RoleSwitcher } from "./HeaderClient";

export async function Header() {
  const me = await getSession();
  const { t } = await getT();
  const home = !me ? "/entrar" : me.role === "member" ? "/portal" : "/staff";
  const link = "hover:text-bull";
  return (
    <header className="border-b border-line">
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-2 lg:px-16">
        <Logo />
        <nav className="flex flex-wrap items-center gap-x-8 gap-y-2 text-lg font-medium">
          <Link href="/horarios" className={link}>{t.nav.schedule}</Link>
          <Link href="/unete" className={link}>{t.nav.join}</Link>
          {me?.role === "member" && <Link href="/portal/ayuda" className={link}>{t.nav.help}</Link>}
          <Link href={home} className={link}>{me ? (me.role === "member" ? t.nav.account : t.nav.team) : t.nav.enter}</Link>
          {me && (
            <>
              {me.role === "member" && <Bell />}
              <RoleSwitcher current={me.id} />
              <LogoutButton />
            </>
          )}
          <LangSwitch />
        </nav>
      </div>
    </header>
  );
}
