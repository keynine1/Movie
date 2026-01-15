import Providers from "./providers";
import Navbar from "@/components/Navbar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
        {/* subtle luxury background */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_20%_0%,rgba(255,255,255,0.08),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_80%_20%,rgba(255,255,255,0.05),transparent_55%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950 to-black" />
        </div>

        <Providers>
          <div className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/70 backdrop-blur">
            <Navbar />
          </div>

          <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
