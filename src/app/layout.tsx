import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar/Navbar";
import { Toaster } from "@/components/ui/Toaster";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Meddit",
  description: "A Reddit clone built with Next.js and TypeScript.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children, authModal }: { children: React.ReactNode; authModal: React.ReactNode }) {
  return (
    <html lang="en" className={cn(" text-white antialiased light", inter.className)}>
      <body className="min-h-screen pt-12  antialiased ">
        <Providers>
          {/* @ts-expect-error server component */}
          <Navbar />
          {authModal}

          <main className="container max-w-7xl mx-auto h-full pt-12">{children}</main>

          <footer></footer>

          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
