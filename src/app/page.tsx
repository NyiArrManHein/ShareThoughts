"use client";

import { useEffect, useState } from "react";
import Post from "./components/Post";
import { FaPlus } from "react-icons/fa";
import useUser from "@/lib/useUser";
import { PostModel, PostType } from "@/lib/models";
import AddPost from "./components/AddPost";

export default function Home() {
  // Use User
  const { data, isLoading, isError } = useUser();

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

  // Upload Posts
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
      const { post, message } = await res.json();
      const newPosts = [...posts, post].reverse();
      setPosts(newPosts);
      setTitle("");
      setContent("");
    }
  };
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
              <Post
                key={"post_" + post.id}
                post={post}
                userId={data.user?.id}
              />
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-1/4 lg:w-6/12 hidden sm:flex">Sidebar</div>
      </div>
    </main>
  );
}
