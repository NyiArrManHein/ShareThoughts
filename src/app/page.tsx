"use client";

import { useEffect, useState } from "react";
import Post from "./components/Post";
import { FaPlus } from "react-icons/fa";
import useUser from "@/lib/useUser";
import { PostModel, PostType } from "@/lib/models";
import AddPost from "./components/AddPost";
import Html from "./components/Html";

export default function Home() {
  // Use User
  const { data, isLoading, isError } = useUser();

  const [isAddPost, setIsAddPost] = useState(false);

  // Controllersaction=""
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Posts
  const [posts, setPosts] = useState<PostModel[]>([]);

  // useEffect(() => {
  //   fetch("/api/posts/", {
  //     method: "GET",
  //     headers: { "Content-Type": "application/json" },
  //   }).then((res) =>
  //     res.json().then(({ posts: fetchedPost }) => setPosts(fetchedPost))
  //   );
  // }, []);

  useEffect(() => {
    fetch("/api/posts/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then((res) =>
      res.json().then(({ posts: fetchedPost }) => {
        // Convert date strings to Date objects
        const postsWithDates = fetchedPost.map((post: PostModel) => ({
          ...post,
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.updatedAt),
        }));
        setPosts(postsWithDates);
      })
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
      post.createdAt = new Date(post.createdAt); // Convert createdAt to Date object
      const newPosts = [post, ...posts];
      setPosts(newPosts);
      setTitle("");
      setContent("");
    }
  };

  const hideAddPost = () => {
    setIsAddPost(!isAddPost);
  };

  const deletePostFromTheList = (postId: number) => {
    const newPosts = posts.filter((post) => post.id !== postId);
    setPosts(newPosts);
  };

  // const updatePostFromTheList = (
  //   postId: number,
  //   postTitle: string,
  //   postContent: string
  // ) => {
  //   setPosts((prevPosts) =>
  //     prevPosts.map((post) =>
  //       post.id == postId
  //         ? { ...post, title: postTitle, content: postContent }
  //         : post
  //     )
  //   );

  // };
  const updatePostFromTheList = (
    postId: number,
    postTitle: string,
    postContent: string
  ) => {
    setPosts((prevPosts) => {
      const updatedPosts = prevPosts.map((post) =>
        post.id === postId
          ? { ...post, title: postTitle, content: postContent }
          : post
      );
      return updatedPosts;
    });
  };

  return (
    <Html showNavbar={true}>
      <main className="flex min-h-screen flex-col items-center justify-between">
        <div className="flex flex-row w-full p-5">
          {/* Left Sidebar */}
          <div className="w-1/4 lg:w-6/12 hidden sm:flex"></div>

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
              hideAddPost={hideAddPost}
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
                  deletePostFromTheList={deletePostFromTheList}
                  updatePostFromTheList={updatePostFromTheList}
                />
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-1/4 lg:w-6/12 hidden sm:flex"></div>
        </div>
      </main>
    </Html>
  );
}
