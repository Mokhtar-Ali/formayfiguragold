import { ImageResponse } from "next/og";
import { tenant } from "@/config/tenant";
import { logoDataUri } from "@/lib/logoData";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Tab icon: the gym's logo when it has one, otherwise the accent color with a monogram. */
export default function Icon() {
  const th = tenant.theme;
  const logo = logoDataUri();
  return new ImageResponse(
    logo ? (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: th.ink, borderRadius: 14 }}>
        <img src={logo} alt="" height={58} style={{ height: 58 }} />
      </div>
    ) : (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: th.ink, color: th.accent, fontSize: 30, fontWeight: 700, border: `3px solid ${th.accent}`, borderRadius: 14 }}>
        FF
      </div>
    ),
    size,
  );
}
