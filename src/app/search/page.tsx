"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Post from "@/app/components/Post";
import { PostModel } from "@/lib/models";
import useUser from "@/lib/useUser";
import Html from "../components/Html";

const Search = () => {
  // Use User
  const { data, isLoading, isError } = useUser();
  const [posts, setPosts] = useState<PostModel[]>([]);
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     const res = await fetch("/api/posts/search", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ query }),
  //     });

  //     if (res.ok) {
  //       const { posts } = await res.json();
  //       setPosts(posts);
  //     }
  //   };

  //   if (query) {
  //     fetchPosts();
  //   }
  // }, [query]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      const res = await fetch("/api/posts/search/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (res.ok) {
        const { searchResults } = await res.json();

        setPosts(Array.isArray(searchResults) ? searchResults : []);
      }

      setLoading(false);
    };

    fetchSearchResults();
  }, [query]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const deletePostFromTheList = (postId: number) => {
    const newPosts = posts.filter((post) => post.id !== postId);
    setPosts(newPosts);
  };

  const updatePostFromTheList = (
    postId: number,
    postTitle: string,
    postContent: string,
    postHashtags: string
  ) => {
    setPosts((prevPosts) => {
      const updatedPosts = prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              title: postTitle,
              content: postContent,
              hashtags: postHashtags,
            }
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

          <div className="w-full px-3">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Post
                  key={"post_" + post.id}
                  post={post}
                  userId={data.user?.id}
                  deletePostFromTheList={deletePostFromTheList}
                  updatePostFromTheList={updatePostFromTheList}
                />
              ))
            ) : (
              <p>No posts found</p>
            )}
          </div>
          {/* Right Sidebar */}
          <div className="w-1/4 lg:w-6/12 hidden sm:flex"></div>
        </div>
      </main>
    </Html>
  );
};

export default Search;
