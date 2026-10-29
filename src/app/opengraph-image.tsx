import { ImageResponse } from "next/og";
import { tenant } from "@/config/tenant";
import { logoDataUri } from "@/lib/logoData";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${tenant.brand.name} ${tenant.brand.subtitle}`;

/** Link preview card (WhatsApp, Instagram, iMessage). */
export default function OgImage() {
  const th = tenant.theme;
  const logo = logoDataUri();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", background: th.ink, color: "#f5f1e6", padding: "0 80px" }}>
        {logo && (
          <img src={logo} alt="" height={500} style={{ height: 500, marginRight: 70 }} />
        )}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, letterSpacing: 8, textTransform: "uppercase", color: "#f5f1e6" }}>{tenant.brand.name}</div>
          <div style={{ fontSize: 120, fontWeight: 700, color: th.accent, marginTop: 8 }}>{tenant.brand.subtitle}</div>
          <div style={{ fontSize: 42, marginTop: 28, maxWidth: 620 }}>{tenant.brand.tagline}</div>
        </div>
      </div>
    ),
    size,
  );
}
