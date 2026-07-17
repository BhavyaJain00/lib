import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Navya Computech — Master the Tech Skills of Tomorrow";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 55%, #3B82F6 100%)",
          color: "#F8FAFC",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#F8FAFC",
              color: "#2563EB",
              borderRadius: 18,
              fontSize: 44,
              fontWeight: 800,
            }}
          >
            N
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 40, fontWeight: 700 }}>Navya Computech</div>
            <div style={{ fontSize: 22, opacity: 0.85 }}>
              ISO 9001:2015 Certified Institute
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 60,
            fontSize: 74,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: -2,
            maxWidth: 950,
          }}
        >
          Master the Tech Skills of Tomorrow
        </div>

        <div
          style={{
            marginTop: 36,
            display: "flex",
            gap: 16,
            fontSize: 24,
          }}
        >
          {["100% Practical Labs", "6+ Master Tracks", "Placement Support"].map(
            (t) => (
              <div
                key={t}
                style={{
                  padding: "10px 24px",
                  background: "rgba(248,250,252,0.14)",
                  border: "1px solid rgba(248,250,252,0.35)",
                  borderRadius: 999,
                }}
              >
                {t}
              </div>
            ),
          )}
        </div>
      </div>
    ),
    size,
  );
}
