// "use client";
// import React, { ReactNode, useEffect, useState } from "react";
// import { Inter } from "next/font/google";
// import Navbar from "./Navbar";
// import { redirect, useRouter } from "next/navigation";
// import useUser from "@/lib/useUser";

// const inter = Inter({ subsets: ["latin"] });

// interface HtmlProps {
//   children: ReactNode;
//   showNavbar?: boolean;
//   // theme: boolean;
//   // setTheme: React.Dispatch<React.SetStateAction<boolean>>;
//   // lang: string;
//   // dataTheme: string;
//   // className: string;
// }

// // function Html({ children }: { children: ReactNode }) {
// function Html({
//   children,
//   showNavbar = true,
// }: // lang,
// // dataTheme,
// // className,
// // theme,
// // setTheme
// HtmlProps) {
//   // useUser
//   const { data, isLoading, isError, mutateUser } = useUser();

//   // States
//   const [theme, setTheme] = useState(true); // True means dark mode
//   const [isPageLoading, setIsPageLoading] = useState(false);

//   const router = useRouter();

//   useEffect(() => {
//     setIsPageLoading(isLoading);
//   }, [isLoading]);

//   const logoutUser = async () => {
//     const res = await fetch("/api/users/logout", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     if (res.ok) {
//       await mutateUser([]);
//       router.push("/"); // Redirect to the home page
//     }
//   };

//   return (
//     <html
//       lang="en"
//       data-theme={theme ? "dark" : "cupcake"}
//       className="w-screen"
//     >
//       <>
//         <body
//           suppressHydrationWarning={true}
//           className={inter.className + " w-full overflow-x-hidden"}
//         >
//           {/* <Navbar
//           theme={theme}
//           setTheme={setTheme}
//           data={data}
//           logoutUser={logoutUser}
//           isLoading={isLoading}
//         /> */}
//           {showNavbar && (
//             <Navbar
//               theme={theme}
//               setTheme={setTheme}
//               data={data}
//               logoutUser={logoutUser}
//               isLoading={isLoading}
//             />
//           )}
//           {isLoading ? "Loading..." : children}
//         </body>
//       </>
//     </html>
//   );
// }

// export default Html;
"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { Inter } from "next/font/google";
import Navbar from "./Navbar";
import { useRouter } from "next/navigation";
import useUser from "@/lib/useUser";

const inter = Inter({ subsets: ["latin"] });

interface HtmlProps {
  children: ReactNode;
  showNavbar?: boolean;
}

function Html({ children, showNavbar = true }: HtmlProps) {
  const { data, isLoading, isError, mutateUser } = useUser();
  const [theme, setTheme] = useState(true); // True means dark mode
  const [isPageLoading, setIsPageLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsPageLoading(isLoading);
  }, []);
  // }, [isLoading]);

  const logoutUser = async () => {
    const res = await fetch("/api/users/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      await mutateUser([]);
      router.push("/"); // Redirect to the home page
    }
  };

  return (
    <div data-theme={theme ? "dark" : "cupcake"} className="w-screen">
      <div className={inter.className + " w-full overflow-x-hidden"}>
        {showNavbar && (
          <Navbar
            theme={theme}
            setTheme={setTheme}
            data={data}
            logoutUser={logoutUser}
            isLoading={isLoading}
          />
        )}
        {isLoading ? "Loading..." : children}
      </div>
    </div>
  );
}

export default Html;
