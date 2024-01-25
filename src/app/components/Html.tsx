"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { Inter } from "next/font/google";
import Navbar from "./Navbar";
import { redirect } from "next/navigation";
import useUser from "@/lib/useUser";

const inter = Inter({ subsets: ["latin"] });

function Html({ children }: { children: ReactNode }) {
  // useUser
  const { data, isLoading, isError, mutateUser } = useUser();

  // States
  const [theme, setTheme] = useState(true); // True means dark mode
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    setIsPageLoading(isLoading);
  }, [isLoading]);

  const logoutUser = async () => {
    const res = await fetch("/api/users/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      await mutateUser([]);
    }
  };

  return (
    <html lang="en" data-theme={theme ? "dark" : "cupcake"}>
      <body suppressHydrationWarning={true} className={inter.className}>
        <Navbar
          theme={theme}
          setTheme={setTheme}
          data={data}
          logoutUser={logoutUser}
          isLoading={isLoading}
        />
        {isLoading ? "Loading..." : children}
      </body>
    </html>
  );
}

export default Html;
