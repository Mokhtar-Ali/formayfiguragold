import { plans } from "@/config/tenant";
import { Words } from "@/components/words";
import { UneteForm } from "./UneteForm";
import { getT } from "@/lib/lang";

export default async function Unete() {
  const { t } = await getT();
  return (
    <div className="mx-auto max-w-3xl px-4 pt-12">
      <h1 className="text-5xl sm:text-6xl"><Words text={t.join.title} /></h1>
      <p className="mt-4 max-w-xl text-muted">{t.join.sub}</p>
      <UneteForm plans={plans} />
    </div>
  );
}
