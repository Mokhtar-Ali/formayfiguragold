import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBar } from "@/components/MobileBar";
import { LangProvider } from "@/components/LangProvider";
import { getLang, getT } from "@/lib/lang";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return {
    title: { default: t.site.metaTitle, template: "%s | Bulltrain Entrenamiento" },
    description: t.site.metaDesc,
    openGraph: { title: t.site.metaTitle, description: t.site.metaDesc, type: "website", locale: "es_CO" },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return (
    <html lang={lang}>
      <body>
        <LangProvider lang={lang}>
          <Header />
          <main>{children}</main>
          <Footer />
          <MobileBar />
        </LangProvider>
      </body>
    </html>
  );
}
