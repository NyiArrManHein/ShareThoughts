import { User } from "@/lib/models";
import React from "react";
import { FaBell, FaMoon, FaSun } from "react-icons/fa";

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
  return (
    <div className="navbar bg-base-200 top-0 sticky z-50">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">ST</a>
      </div>
      <div className="flex-none gap-2">
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
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
          />
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
                  <img
                    alt="Tailwind CSS Navbar component"
                    src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
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
          <span>Login</span>
        )}
      </div>
    </div>
  );
}

export default Navbar;
