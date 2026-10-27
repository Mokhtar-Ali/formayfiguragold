import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBar } from "@/components/MobileBar";
import { PromoBar } from "@/components/PromoBar";
import { LangProvider } from "@/components/LangProvider";
import { getLang, getT } from "@/lib/lang";
import { tenant } from "@/config/tenant";

const BRAND = `${tenant.brand.name} ${tenant.brand.subtitle}`;
const th = tenant.theme;
/** The gym's colors and fonts, written over the fallbacks in globals.css. */
const THEME_CSS = `:root{--color-ink:${th.ink};--color-surface:${th.surface};--color-surface-2:${th.surface2};--color-line:${th.line};--color-paper:${th.paper};--color-muted:${th.muted};--color-accent:${th.accent};--color-accent-ink:${th.accentInk};--color-accent-2:${th.accent2};--font-display:${th.fontDisplay};--font-sans:${th.fontSans};--heading-case:${th.headingCase};--heading-weight:${th.headingWeight};--heading-tracking:${th.headingTracking}}`;

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return {
    title: { default: t.site.metaTitle, template: `%s | ${BRAND}` },
    description: t.site.metaDesc,
    openGraph: { title: t.site.metaTitle, description: t.site.metaDesc, type: "website", locale: "es_CO", siteName: BRAND },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return (
    <html lang={lang}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: THEME_CSS }} />
      </head>
      <body>
        <LangProvider lang={lang}>
          <PromoBar />
          <Header />
          <main>{children}</main>
          <Footer />
          <MobileBar />
        </LangProvider>
      </body>
    </html>
  );
}
