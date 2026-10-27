import { ImageResponse } from "next/og";
import { tenant } from "@/config/tenant";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Generated tab icon: the gym's accent color with a monogram. Replace when the real logo arrives. */
export default function Icon() {
  const th = tenant.theme;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: th.ink, color: th.accent, fontSize: 30, fontWeight: 700, border: `3px solid ${th.accent}`, borderRadius: 14 }}>
        FF
      </div>
    ),
    size,
  );
}
