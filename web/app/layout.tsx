import { type Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Cantata_One, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/ui/Sidebar";
import { dark } from "@clerk/themes";

const cantata = Cantata_One({
  weight: "400",
  variable: "--font-serif",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  weight: "400",
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Manimator",
  description: "Make animation using manim without code.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" className="dark">
        <body
          className={`${cantata.variable} ${spaceGrotesk.className} antialiased relative bg-zinc-900 text-white flex`}
        >
          {/* <Sidebar /> */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
