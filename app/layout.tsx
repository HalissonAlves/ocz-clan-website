import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import "./globals.css";

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "OCZ Clan | A caçada pela glória",
    template: "%s | OCZ Clan",
  },
  description:
    "Competições, conquistas e troféus do clã OCZ em The Hunter: Call of the Wild.",
  applicationName: "OCZ Clan",
  keywords: [
    "OCZ Clan",
    "The Hunter Call of the Wild",
    "competições",
    "troféus",
    "clã",
  ],
  icons: {
    icon: "/assets/ocz_brasao.png",
    apple: "/assets/ocz_brasao.png",
  },
  openGraph: {
    title: "OCZ Clan | A caçada pela glória",
    description: "Conheça as competições e a sala de troféus do clã OCZ.",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/assets/ocz_brasao.png",
        width: 1080,
        height: 1080,
        alt: "Brasão do clã OCZ",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="site-shell">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
