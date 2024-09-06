import { NotificationModel, User } from "@/lib/models";
import React, { useEffect, useState } from "react";
import {
  FaBell,
  FaMoon,
  FaSearch,
  FaSun,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import Image from "next/image";
import profilePic from "../img/profile.webp";
import adminPic from "../img/admin1.jpg";
import authPic from "../img/authentication.jpg";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { confirmAlert } from "react-confirm-alert";
import { Role } from "@prisma/client";

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>();
  const router = useRouter();

  const fetchNotification = async () => {
    try {
      const res = await fetch("/api/posts/report/notification/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        // const notificationsArray = Array.isArray(data.notification)
        //   ? data.notification
        //   : [];
        console.log("Data", data);
        setNotifications(data);
      } else {
        console.error("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  useEffect(() => {
    fetchNotification();
  }, []);

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

  const toggleSearchBar = () => {
    setIsExpanded(!isExpanded);
    setSearchQuery(""); // Clear the search query when closing
  };

  const openSearchModal = () => {
    const modal = document.getElementById(
      "search_modal_"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  const handleNotificationClick = (notification: NotificationModel) => {
    const queryParams = new URLSearchParams({
      title: notification.post.title,
      content: notification.post.content,
    }).toString();
    router.push(`/notificationView?${queryParams}`);
  };

  const removeNotification = async (
    e: React.MouseEvent,
    notification: NotificationModel
  ) => {
    e.stopPropagation();
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to remove this notification?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            const data = {
              notificationId: notification.id,
            };
            const res = await fetch("/api/posts/report/notification/", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            if (res.ok) {
              const { isDeleted, message } = await res.json();
              if (isDeleted) {
                const newNoti = notifications.filter(
                  (noti) => noti.id !== notification.id
                );
                setNotifications(newNoti);
                toast(message);
              } else {
                toast(message);
              }
            }
          },
        },
        {
          label: "No",
          onClick: () => {
            // Do nothing
          },
        },
      ],
    });
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
        {!isExpanded && (
          <div className="flex flex-row" onClick={() => setTheme(!theme)}>
            <span className={theme ? "px-1" : "px-1 text-warning"}>
              <FaSun />
            </span>
            <span className={theme ? "px-1 text-warning" : "px-1"}>
              <FaMoon />
            </span>
          </div>
        )}

        {data && data.user?.role !== Role.ADMIN && (
          <div className="form-control">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search"
                className="input input-bordered w-52 hidden md:block"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            {/* <FaSearch onClick={openSearchModal} /> */}
            <div className="flex items-center md:hidden">
              {isExpanded ? (
                <div className="flex items-center w-full sm:w-72 transition-all duration-300 ease-in-out me-7">
                  <form onSubmit={handleSearch}>
                    <input
                      type="text"
                      placeholder="Search..."
                      className="input input-bordered w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>
                  <FaTimes
                    className="ml-2 cursor-pointer text-gray-600"
                    onClick={toggleSearchBar}
                  />
                </div>
              ) : (
                <FaSearch
                  className="cursor-pointer text-gray-600"
                  onClick={toggleSearchBar}
                />
              )}
            </div>
          </div>
        )}

        {isLoading ? (
          "Loading..."
        ) : data.isLoggedIn ? (
          <>
            {data && data.user?.role !== Role.ADMIN && !isExpanded && (
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="text text-3xl text-success indicator"
                >
                  {notifications.length > 0 && (
                    <span className="indicator-item text text-xs badge badge-info">
                      {notifications.length}
                    </span>
                  )}

                  <FaBell onClick={() => setIsDropDownOpen(true)} />
                </div>
                {notifications.length > 0 && isDropDownOpen && (
                  <ul
                    tabIndex={0}
                    className=" border-base-300 mt-3 z-[1] p-2 shadow menu menu-md dropdown-content bg-base-200 rounded-box w-96 -left-72"
                  >
                    <div className="flex flex-row justify-between px-6 mb-3">
                      <h1>Notification</h1>
                      <FaTimes
                        className="cursor-pointer"
                        onClick={() => {
                          setIsDropDownOpen(false);
                        }}
                      />
                    </div>

                    {notifications.map((notification, index) => (
                      <li
                        key={index}
                        className="mb-5"
                        onClick={() => {
                          // setTitle(notification.post.title);
                          // setContent(notification.post.content);
                          // setIsModalOpen(true);
                          handleNotificationClick(notification);
                        }}
                      >
                        <div>
                          <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost btn-circle avatar"
                          >
                            <div className="w-10 rounded-full">
                              <Image
                                src={adminPic}
                                alt="Profile Picture"
                                width={50}
                                height={50}
                              />
                            </div>
                          </div>

                          <a>
                            Your post has been removed. Multiple users reported
                            this post, and after reviewing, we determined it
                            goes against our guidelines.
                          </a>

                          <FaTrash
                            onClick={(e) => {
                              removeNotification(e, notification);
                            }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {!isExpanded && (
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full">
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
                  {/* <li>
                  <a>Settings</a>
                </li> */}
                  <li>
                    <a onClick={logoutUser}>Logout</a>
                  </li>
                </ul>
              </div>
            )}
          </>
        ) : (
          <>
            {!isExpanded && (
              <div className="dropdown dropdown-end md:hidden">
                <div tabIndex={0} role="button" className="text text-3xl">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar me-7"
                  >
                    <div className="w-10 rounded-full">
                      <Image
                        src={authPic}
                        alt="Auth Pic"
                        width={50}
                        height={50}
                      />
                    </div>
                  </div>
                </div>

                <ul
                  tabIndex={0}
                  className=" border-base-300 mt-3 z-[1] p-2 shadow menu menu-md dropdown-content bg-base-200 rounded-box w-28 me-5"
                >
                  <li>
                    <a href="/auth">SignUp</a>
                  </li>
                  <li>
                    <a
                      className="cursor-pointer"
                      onClick={() => {
                        router.push("/auth?isRegister=false");
                      }}
                    >
                      LogIn
                    </a>
                  </li>
                </ul>
              </div>
            )}
            <div className="me-3 hidden md:block">
              <a className="me-2" href="/auth">
                SignUp
              </a>
              <a
                className="cursor-pointer"
                onClick={() => {
                  router.push("/auth?isRegister=false");
                }}
              >
                LogIn
              </a>
            </div>
          </>
        )}
      </div>
      {isModalOpen && (
        <dialog className="modal" open>
          <div className="modal-box relative">
            <div className="flex justify-end">
              <button
                className="w-4"
                type="button"
                onClick={() => setIsModalOpen(false)}
              >
                X
              </button>
            </div>
            <h2>{title}</h2>
            <p>{content}</p>
          </div>
        </dialog>
      )}

      {/* Search modal */}
      <dialog id="search_modal_" className="modal">
        <div className="modal-box relative">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className="absolute inset-0 w-full h-full bg-black opacity-30"></button>
        </form>
      </dialog>
    </nav>
  );
}

export default Navbar;
