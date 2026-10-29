import { ImageResponse } from "next/og";
import { tenant } from "@/config/tenant";
import { logoDataUri } from "@/lib/logoData";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon for iPhones. */
export default function AppleIcon() {
  const th = tenant.theme;
  const logo = logoDataUri();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: th.ink, color: th.accent, fontSize: 84, fontWeight: 700 }}>
        {logo ? (
          <img src={logo} alt="" height={160} style={{ height: 160 }} />
        ) : (
          "FF"
        )}
      </div>
    ),
    size,
  );
}
