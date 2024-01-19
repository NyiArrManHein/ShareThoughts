"use client";

import { useState } from "react";
import Post from "./components/Post";

export default function Home() {
  const [isAddPost, setIsAddPost] = useState(false);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex flex-row w-full p-5">
        <div className=" w-1/4 hidden sm:flex">Page Links</div>
        <div className="w-full px-3">
          <span
            className={isAddPost ? "hidden" : "btn mb-1"}
            onClick={() => setIsAddPost(!isAddPost)}
          >
            New Post
          </span>
          <div
            className={
              isAddPost
                ? "card card-bordered flex flex-col text-justify p-3 mb-1 sm:text-sm text-base w-full"
                : "hidden"
            }
          >
            <input
              type="text"
              className="input input-ghost w-full"
              name="title"
              id="title"
              placeholder="Title..."
            />
            <textarea
              className="input input-ghost w-full"
              name="content"
              id="content"
              placeholder="Content ..."
            ></textarea>
            <div>
              <input
                type="submit"
                className="btn btn-primary w-fit float-right mt-1"
                value="Post"
              />
            </div>
          </div>
          <div>
            <Post />
            <Post />
            <Post />
            <Post />
          </div>
        </div>
        <div className=" w-1/4 hidden sm:flex">Sidebar</div>
      </div>
    </main>
  );
}
