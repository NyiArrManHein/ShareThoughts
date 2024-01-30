"use client";

import { useState } from "react";
import Post from "./components/Post";
import { FaPlus } from "react-icons/fa";
import useUser from "@/lib/useUser";

export default function Home() {
  const [isAddPost, setIsAddPost] = useState(false);

  // Controllersaction=""
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Posts
  const [posts, setPosts] = useState([]);

  // useUser
  const { data, isLoading, isError, mutateUser } = useUser();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex flex-row w-full p-5">
        {/* Left Sidebar */}
        <div className="w-1/4 lg:w-6/12 hidden sm:flex">Page Links</div>

        {/* Posts */}
        <div className="w-full px-3">
          {/* Add Post Bottom */}
          {isLoading ? (
            "Loading ..."
          ) : data.isLoggedIn ? (
            <span
              className={isAddPost ? "hidden" : "btn mb-1"}
              onClick={() => setIsAddPost(!isAddPost)}
            >
              <FaPlus /> Add Post
            </span>
          ) : (
            ""
          )}
          <form>
            <div
              className={
                isAddPost
                  ? "card card-bordered border-base-300 flex flex-col text-justify p-3 mb-1 sm:text-sm text-base w-full"
                  : "hidden"
              }
            >
              <input
                type="text"
                className="input input-ghost w-full"
                name="title"
                id="title"
                placeholder="Title..."
                onChange={(e) => setTitle(e.currentTarget.value)}
              />
              <textarea
                className="input input-ghost w-full"
                name="content"
                id="content"
                placeholder="Content ..."
                onChange={(e) => setContent(e.currentTarget.value)}
              ></textarea>
              <div>
                <input
                  type="submit"
                  className="btn btn-primary w-fit float-right mt-1"
                  value="Post"
                />
              </div>
            </div>
          </form>
          <div>
            <Post />
            <Post />
            <Post />
            <Post />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-1/4 lg:w-6/12 hidden sm:flex">Sidebar</div>
      </div>
    </main>
  );
}
