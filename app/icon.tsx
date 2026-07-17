import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
          borderRadius: 8,
          color: "#F8FAFC",
          fontSize: 20,
          fontWeight: 800,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        N
      </div>
    ),
    size,
  );
}
