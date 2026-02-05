import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import Satoshi from "next/font/local";
import "../styles/globals.scss";
import { ReactQueryProvider } from "../providers/ReactQueryProvider";
import { PopupProvider } from "../providers/PopupProvider";
import { LocaleProvider } from "../providers/LocaleProvider";

const satoshi900 = Satoshi({
  src: [
    {
      path: "../../public/fonts/Satoshi-900.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-satoshi-900",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blaze Casino",
  description:
    "Blaze Casino is a online casino that offers a wide range of games and bonuses to its players.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${manrope.variable} ${satoshi900.variable}`}
      >
        <ReactQueryProvider>
          <LocaleProvider>
            <PopupProvider>{children}</PopupProvider>
          </LocaleProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
