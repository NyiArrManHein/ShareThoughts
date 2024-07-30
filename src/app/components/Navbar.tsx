import { User } from "@/lib/models";
import React, { useState } from "react";
import { FaBell, FaMoon, FaSun } from "react-icons/fa";
import Image from "next/image";
import profilePic from "../img/profile.webp";
import { useRouter } from "next/navigation";

function Navbar({
  theme,
  setTheme,
  data,
  logoutUser,
  isLoading,
}: {
  theme: boolean;
  setTheme: React.Dispatch<React.SetStateAction<boolean>>;
  data: {
    user: User | undefined;
    isLoggedIn: boolean;
    message: string;
  };
  logoutUser: () => Promise<void>;
  isLoading: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let cleanedQuery = searchQuery.trim().toLowerCase().replace(/\s+/g, "");
    const encodedQuery = encodeURIComponent(cleanedQuery);

    // if (cleanedQuery.startsWith("#")) {
    //   cleanedQuery = cleanedQuery.substring(1);
    // }
    // cleanedQuery = cleanedQuery.replace(/\s+/g, ""); // Remove all spaces
    // console.log("Cleaned Query:", cleanedQuery);

    if (cleanedQuery) {
      router.push(`/search?query=${encodedQuery}`);
    }
  };
  return (
    <nav className="navbar bg-base-200 top-0 sticky z-50 w-full">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl block md:hidden">ST</a>
        <a className="btn btn-ghost text-xl hidden md:block">
          Share Thoughts For Everyone
        </a>
      </div>
      <div className="flex-none gap-2 pr-2">
        {/* Theme Changer */}
        <div className="flex flex-row" onClick={() => setTheme(!theme)}>
          <span className={theme ? "px-1" : "px-1 text-warning"}>
            <FaSun />
          </span>
          <span className={theme ? "px-1 text-warning" : "px-1"}>
            <FaMoon />
          </span>
        </div>
        <div className="form-control">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-24 md:w-auto"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {isLoading ? (
          "Loading..."
        ) : data.isLoggedIn ? (
          <>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="text text-3xl text-success indicator"
              >
                <span className="indicator-item text text-xs badge badge-info">
                  1
                </span>
                <FaBell />
              </div>
              <ul
                tabIndex={0}
                className=" border-base-300 mt-3 z-[1] p-2 shadow menu menu-md dropdown-content bg-base-200 rounded-box w-80"
              >
                <li>
                  <a className="justify-between">
                    Someone liked your post.
                    <span className="badge">New</span>
                  </a>
                </li>
                <li>
                  <a>Read your report</a>
                </li>
              </ul>
            </div>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  {/* <img
                    alt="Tailwind CSS Navbar component"
                    src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                  /> */}
                  <Image
                    src={profilePic}
                    alt="Profile Picture"
                    width={50}
                    height={50}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <a className="justify-between">
                    {data.user?.username}
                    <span className="badge">New</span>
                  </a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a onClick={logoutUser}>Logout</a>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <a href="/auth">SignUp</a>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
