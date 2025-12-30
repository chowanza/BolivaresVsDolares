import type { Metadata } from "next";
import "./globals.css";
import { RatesProvider } from "@/context/RatesContext";

export const metadata: Metadata = {
  title: "VzlaSmartPay",
  description: "Protege tu poder adquisitivo en Venezuela",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-gray-50 dark:bg-gray-950 min-h-screen">
        <RatesProvider>
          {children}
        </RatesProvider>
      </body>
    </html>
  );
}