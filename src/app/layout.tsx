import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { QueryProvider } from "@/providers/query-provider";
import { NavBar } from "@/components/nav-bar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Multiple Activities App - Ivhan Salazar",
  description: "Multiple Activities Management Portal by Ivhan Salazar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <QueryProvider>
          <AuthProvider>
            <NavBar />
            <main className="min-h-screen">{children}</main>
            <Toaster position="top-center" richColors />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
