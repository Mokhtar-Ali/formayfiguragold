import { EntrarClient } from "./EntrarClient";
import { getT } from "@/lib/lang";

export default async function Entrar() {
  const { t } = await getT();
  return (
    <div className="mx-auto max-w-3xl px-4 pt-12">
      <h1 className="text-5xl sm:text-6xl">{t.enter.title}</h1>
      <p className="mt-4 max-w-xl text-muted">{t.enter.sub}</p>
      <EntrarClient />
    </div>
  );
}
