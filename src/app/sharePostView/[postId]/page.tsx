"use client";
import { useEffect, useState } from "react";
import { PostModel } from "@/lib/models";
import Post from "@/app/components/Post";
import useUser from "@/lib/useUser";
import Html from "@/app/components/Html";
import { useRouter } from "next/navigation";
import { Role } from "@prisma/client";

interface SharedPostViewProps {
  params: { postId: string };
}

const SharedPostView = ({ params }: SharedPostViewProps) => {
  const { postId } = params;
  const [post, setPost] = useState<PostModel | null>(null);
  const { data, isLoading, isError } = useUser();
  const router = useRouter();

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
        const response = await fetch(`/api/posts/sharePostView/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId }),
        });

        const data = await response.json();
        if (response.status === 200) {
          setPost({
            ...data.post,
            createdAt: new Date(data.post.createdAt),
            updatedAt: new Date(data.post.updatedAt),
          });
        } else if (response.status === 403) {
          const currentPath = window.location.pathname;
          router.push(`/auth?redirectTo=${encodeURIComponent(currentPath)}`);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    if (postId) {
      fetchPostById(postId);
    }
  }, [postId, router]);

  useEffect(() => {
    if (!isLoading && data) {
      if (data.user?.role === Role.ADMIN) {
        // Redirect to the admin page
        router.push("/admin");
      }
    }
  }, [data, isLoading, router]);

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
