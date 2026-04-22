import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maverick Game Tycoon",
  description: "Build your game studio from a garage to a global empire, 1980-2045.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Maverick",
    // black-translucent lets the status bar sit over the page bg like native apps
    statusBarStyle: "black-translucent",
  },
  // Hint to iOS that this is not a phone number / address so it doesn't auto-link
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
};

// Next 14 viewport export — controls the <meta name="viewport"> tag and theme-color.
// userScalable=false + maximumScale=1 keep the layout locked like a native iPhone app
// (no pinch-zoom, no double-tap zoom, no rubber-banding the title bar on focus).
// viewportFit=cover extends content behind the iOS notch / home indicator.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0a0805",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Landscape lock — iOS Safari ignores manifest.orientation, so we show
            a full-screen "rotate your device" overlay whenever the viewport
            goes landscape. The CSS lives in globals.css (#landscape-lock). */}
        <div id="landscape-lock" aria-hidden="true">
          <div className="lock-card">
            <div className="lock-icon">↻</div>
            <div className="lock-title">Rotate your device</div>
            <div className="lock-sub">Maverick Game Tycoon is designed for portrait.</div>
          </div>
        </div>
      </body>
    </html>
  );
}
