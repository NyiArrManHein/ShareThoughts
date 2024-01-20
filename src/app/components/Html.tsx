"use client";
import React, { ReactNode, useState } from "react";
import { Inter } from "next/font/google";
import Navbar from "./Navbar";

const inter = Inter({ subsets: ["latin"] });

function Html({ children }: { children: ReactNode }) {
  // States
  const [theme, setTheme] = useState(true); // True means dark mode

  return (
    <html lang="en" data-theme={theme ? "dark" : "cupcake"}>
      <body suppressHydrationWarning={true} className={inter.className}>
        <Navbar theme={theme} setTheme={setTheme} />
        {children}
      </body>
    </html>
  );
}

export default Html;
