"use client";
import Html from "@/app/components/Html";
import Post from "@/app/components/Post";
import { PostModel } from "@/lib/models";
import useUser from "@/lib/useUser";
import { useEffect, useState } from "react";

interface HashtagViewProps {
  params: { hashtagId: string };
}

const HashtagView = ({ params }: HashtagViewProps) => {
  const { data, isLoading, isError } = useUser();
  const { hashtagId } = params;
  const decodedHashtagId = decodeURIComponent(hashtagId);
  const [posts, setPosts] = useState<PostModel[]>([]);

  useEffect(() => {
    // if (!hashtagId) return;
    if (!decodedHashtagId) return;

    fetch("/api/posts/hashtagView", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decodedHashtagId }),
    })
      .then((res) => res.json())
      .then(({ posts: fetchedPosts }) => {
        const postsWithDates = fetchedPosts.map((post: PostModel) => ({
          ...post,
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.updatedAt),
        }));
        setPosts(postsWithDates);
      });
  }, [decodedHashtagId]);

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
            {data &&
              posts.map((post) => (
                <Post
                  key={`post_${post.id}`}
                  post={post}
                  userId={data.user?.id}
                  deletePostFromTheList={deletePostFromTheList}
                  updatePostFromTheList={updatePostFromTheList}
                />
              ))}
          </div>
          {/* Right Sidebar */}
          <div className="w-1/4 lg:w-6/12 hidden sm:flex"></div>
        </div>
      </main>
    </Html>
  );
};

export default HashtagView;
