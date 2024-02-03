"use client";

import { FormEvent, SetStateAction, useEffect, useState } from "react";
import Post from "./components/Post";
import { FaPlus } from "react-icons/fa";
import useUser from "@/lib/useUser";
import { PostType } from "@/lib/models";
import { Post as PostModel } from "@prisma/client";
import AddPost from "./components/AddPost";

export default function Home() {
  const [isAddPost, setIsAddPost] = useState(false);

  // Controllersaction=""
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Posts
  const [posts, setPosts] = useState<PostModel[]>([]);

  useEffect(() => {
    fetch("/api/posts/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then((res) =>
      res.json().then(({ posts: fetchedPost }) => setPosts(fetchedPost))
    );
  }, []);

  const submitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      postType: PostType.PUBLIC,
      title: title,
      content: content,
    };
    const res = await fetch("/api/posts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const { post } = await res.json();
      setPosts([post, ...posts]);
    }
  };

  // useUser
  const { data, isLoading, isError } = useUser();
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
          <AddPost
            submitPost={submitPost}
            isAddPost={isAddPost}
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
          />
          <div>
            {posts.map((post) => (
              <Post post={post} />
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-1/4 lg:w-6/12 hidden sm:flex">Sidebar</div>
      </div>
    </main>
  );
}
