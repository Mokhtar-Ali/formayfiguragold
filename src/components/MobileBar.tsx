import Link from "next/link";
import { tenant } from "@/config/tenant";
import { getSession } from "@/lib/auth";
import { getT } from "@/lib/lang";

const wa = "h-5 w-5 fill-current";

/** Sticky booking and WhatsApp bar on phones, round WhatsApp button on larger screens. Hidden for staff. */
export async function MobileBar() {
  const me = await getSession();
  if (me && me.role !== "member") return null;
  const { t } = await getT();
  const href = me ? "/portal#reservar" : "/horarios";
  const wapp = `${tenant.contact.whatsappHref}?text=${encodeURIComponent(t.site.waMsg)}`;
  const icon = <svg viewBox="0 0 24 24" className={wa} aria-hidden><path d="M12 2a10 10 0 0 0-8.600 15.100L2 22l5-1.300A10 10 0 1 0 12 2zm0 18.200a8.200 8.200 0 0 1-4.200-1.200l-.3-.2-3 .8.800-2.900-.2-.3A8.200 8.200 0 1 1 12 20.200zm4.500-6.100c-.2-.1-1.500-.7-1.700-.8-.2-.1-.4-.1-.6.100l-.8 1c-.1.200-.3.200-.5.100a6.700 6.700 0 0 1-3.300-2.900c-.2-.4.200-.4.700-1.300.1-.2 0-.3 0-.5l-.8-1.800c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.100-.7.300-.2.300-.9.900-.9 2.200s.9 2.500 1.100 2.700c.1.200 1.800 2.800 4.400 3.900 1.600.7 2.300.8 3.100.7.500-.1 1.500-.6 1.700-1.200.2-.6.200-1.100.2-1.200-.1-.2-.3-.2-.5-.3z" /></svg>;
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-ink/95 p-3 backdrop-blur md:hidden">
        <Link href={href} className="flex-1 bg-accent py-3 text-center font-semibold text-accent-ink">{t.site.reserve}</Link>
        <a href={wapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border border-line px-4 py-3 font-semibold">{icon}{t.site.whatsapp}</a>
      </div>
      <a href={wapp} target="_blank" rel="noopener noreferrer" aria-label={t.site.whatsapp} className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 place-items-center rounded-full bg-[#25d366] text-black shadow-lg hover:brightness-110 md:grid">
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden><path d="M12 2a10 10 0 0 0-8.600 15.100L2 22l5-1.300A10 10 0 1 0 12 2zm0 18.200a8.200 8.200 0 0 1-4.200-1.200l-.3-.2-3 .8.800-2.900-.2-.3A8.200 8.200 0 1 1 12 20.200zm4.500-6.100c-.2-.1-1.500-.7-1.700-.8-.2-.1-.4-.1-.6.100l-.8 1c-.1.200-.3.200-.5.100a6.700 6.700 0 0 1-3.300-2.900c-.2-.4.200-.4.700-1.300.1-.2 0-.3 0-.5l-.8-1.800c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.100-.7.300-.2.300-.9.900-.9 2.200s.9 2.500 1.100 2.700c.1.200 1.800 2.800 4.400 3.900 1.600.7 2.300.8 3.100.7.500-.1 1.500-.6 1.700-1.200.2-.6.200-1.100.2-1.200-.1-.2-.3-.2-.5-.3z" /></svg>
      </a>
    </>
  );
}
