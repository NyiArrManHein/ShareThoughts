"use client";
import { useEffect, useState } from "react";
import { PostModel } from "@/lib/models";
import Post from "@/app/components/Post";
import useUser from "@/lib/useUser";
import Html from "@/app/components/Html";

interface SharedPostViewProps {
  params: { postId: string };
}

const SharedPostView = ({ params }: SharedPostViewProps) => {
  const { postId } = params;
  const [post, setPost] = useState<PostModel | null>(null);
  const { data, isLoading, isError } = useUser();

  // useEffect(() => {
  //   if (!postId) return;

  //   fetch("/api/posts/sharePostView/", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ postId }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setPost({
  //         ...data,
  //         createdAt: new Date(data.createdAt),
  //         updatedAt: new Date(data.updatedAt),
  //       });
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching post:", error);
  //     });
  // }, [postId]);

  useEffect(() => {
    const fetchPostById = async (postId: string) => {
      try {
        console.log("Fetching post with ID:", postId);

        const response = await fetch(`/api/posts/sharePostView/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId }),
        });

        const data = await response.json();
        console.log("Fetched post data:", data);
        setPost(data.post);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    if (postId) {
      fetchPostById(postId);
    }
  }, [postId]);

  if (!post) {
    return <p>Loading...</p>;
  }

  const deletePostFromTheList = (postId: number) => {
    setPost(null);
  };

  const updatePostFromTheList = (
    postId: number,
    postTitle: string,
    postContent: string,
    postHashtags: string
  ) => {
    setPost((prevPost) => {
      if (!prevPost || prevPost.id !== postId) return prevPost;

      return {
        ...prevPost,
        title: postTitle,
        content: postContent,
        hashtags: postHashtags,
      };
    });
  };

  return (
    <Html showNavbar={true}>
      <main className="flex min-h-screen flex-col items-center justify-between">
        <div className="flex flex-row w-full p-5">
          {/* Left Sidebar */}
          <div className="w-1/4 lg:w-6/12 hidden sm:flex"></div>
          <div className="w-full px-3">
            <Post
              post={post}
              userId={data.user?.id}
              deletePostFromTheList={deletePostFromTheList}
              updatePostFromTheList={updatePostFromTheList}
            />
          </div>
          {/* Right Sidebar */}
          <div className="w-1/4 lg:w-6/12 hidden sm:flex"></div>
        </div>
      </main>
    </Html>
  );
};

export default SharedPostView;
