"use client";
import React, { useEffect, useState } from "react";
import { PostModel } from "@/lib/models";
import Post from "@/app/components/Post";
import useUser from "@/lib/useUser";
import Image from "next/image";
import profilePic from "../../img/profile.webp";
import Modal from "@/app/components/Modal";
import Html from "@/app/components/Html";

interface ProfileViewProps {
  params: { authorId: string };
}

const ProfileView = ({ params }: ProfileViewProps) => {
  const { data, isLoading, isError } = useUser();
  const { authorId } = params;
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [authorUsername, setAuthorUsername] = useState<string>("");
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [userId, setUserId] = useState<number | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string[]>([]);
  const [modalTitle, setModalTitle] = useState<string>("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts/profileView", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ authorId }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const { userPosts, followerCount, followingCount } =
          await response.json();
        // Convert date strings to Date objects
        const postsWithDates = userPosts.map((post: PostModel) => ({
          ...post,
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.updatedAt),
        }));
        setPosts(postsWithDates);
        if (userPosts.length > 0 && userPosts[0].author) {
          setAuthorUsername(userPosts[0].author.username);
          setUserId(userPosts[0].author.id);
        }
        setFollowerCount(followerCount);
        setFollowingCount(followingCount);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    };
    const checkFollowingStatus = async () => {
      try {
        const response = await fetch(`/api/follow?authorId=${authorId}}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setIsFollowing(data.isFollowing);
        }
      } catch (error) {
        console.error("Failed to check follow status", error);
      }
    };

    fetchPosts();
    checkFollowingStatus();
  }, [authorId]);

  const deletePostFromTheList = (postId: number) => {
    const newPosts = posts.filter((post) => post.id !== postId);
    setPosts(newPosts);
  };

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

  const handleFollowClick = async () => {
    try {
      const response = await fetch("/api/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ authorId }),
      });
      if (response.ok) {
        const { followerCount } = await response.json();
        setIsFollowing((prev) => !prev);
        setFollowerCount(followerCount);
      }
    } catch (error) {
      console.error("Failed to follow/unfollow", error);
    }
  };

  const fetchModalContent = async (type: "followers" | "following") => {
    try {
      const response = await fetch(`/api/follow/${type}?userId=${authorId}`);
      if (response.ok) {
        const data = await response.json();
        setModalContent(data.usernames);
        setModalTitle(type === "followers" ? "Followers" : "Following");
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error(`Failed to fetch ${type}`, error);
    }
  };

  return (
    <Html showNavbar={false}>
      <>
        {/* {userId !== data.user?.id && (
        <button
          onClick={handleFollowClick}
          className={`mt-4 px-4 py-2 rounded ${
            isFollowing ? "bg-red-500 text-white" : "bg-blue-500 text-white"
          }`}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      )} */}

        <main className="flex min-h-screen flex-col items-center justify-between">
          <div className="flex flex-row w-full p-5">
            {/* Left Sidebar */}
            <div className="w-1/4 lg:w-6/12 hidden sm:flex"></div>

            <div className="w-full px-3">
              <div className="flex flex-row justify-evenly">
                <div className="flex flex-col">
                  <div
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
                  <span className=" pt-2 pl-2">{authorUsername}</span>
                  {userId !== data.user?.id && (
                    <button
                      onClick={handleFollowClick}
                      className={`mt-4 px-4 py-1 rounded border ${
                        isFollowing
                          ? "bg-black border-white text-white"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  )}
                </div>
                <div
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => fetchModalContent("followers")}
                >
                  <span>{followerCount}</span>

                  <span>Followers</span>
                </div>

                <div
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => fetchModalContent("following")}
                >
                  <span>{followingCount}</span>

                  <span>Following</span>
                </div>
              </div>

              {posts.map((post) => (
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
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2>{modalTitle}</h2>
          <ul>
            {modalContent.map((username, index) => (
              <div className="flex flex-row items-center">
                <div role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-8 rounded-full">
                    <Image
                      src={profilePic}
                      alt="Profile Picture"
                      width={50}
                      height={50}
                    />
                  </div>
                </div>
                <li key={index}>{username}</li>
              </div>
            ))}
          </ul>
        </Modal>
      </>
    </Html>
  );
};

export default ProfileView;
