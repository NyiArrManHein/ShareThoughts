"use client";

import { PostModel } from "@/lib/models";
import { Like, Reactions } from "@prisma/client";
import React, { useState } from "react";
import {
  FaClock,
  FaComment,
  FaHeart,
  FaLaugh,
  FaSadCry,
  FaShare,
  FaThumbsUp,
} from "react-icons/fa";

function Post({
  post,
  userId,
  deletePostFromTheList,
}: {
  post: PostModel;
  userId?: number;
  deletePostFromTheList: (postId: number) => void;
}) {
  const [currentPost, setCurrentPost] = useState(post);
  const [reaction, setReaction] = useState<Reactions | undefined>(
    currentPost.likes.filter((like) => like.userId === userId)[0]?.reaction
  );
  const [isComment, setIsComment] = useState(false);
  const [comment, setComment] = useState("");

  // Like Post
  const reactPost = async (reaction: Reactions) => {
    if (userId) {
      // Send to the server
      const data = {
        postId: post.id,
        reactionType: reaction,
      };
      const res = await fetch("/api/posts/react/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const { react, message }: { react: Like | undefined; message: string } =
          await res.json();
        if (react) {
          const isThereReaction = post.likes.filter(
            (like) => like.userId === react.userId && like.reaction === reaction
          )[0];
          const reactedPost = post.likes.filter(
            (like) => like.userId !== react.userId
          );
          post.likes = reactedPost;
          if (isThereReaction === undefined) {
            post.likes.push(react);
            // setting the post to update the UI

            // Setting new reaction to update the UI
            setReaction(reaction);
          } else {
            setReaction(undefined);
          }
          setCurrentPost(post);
          // alert(message);
        } else {
          alert(message);
        }
      }
    }
  };

  // Delete Post
  const deletePost = async () => {
    const data = {
      postId: currentPost.id,
    };
    const res = await fetch("/api/posts/", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const { isDeleted, message }: { isDeleted: boolean; message: string } =
        await res.json();
      if (isDeleted) {
        // Delete Post
        deletePostFromTheList(currentPost.id);
      } else {
        alert(message);
      }
    }
  };

  return (
    <div className="card card-bordered border-base-300 flex flex-col text-justify p-3 mb-1 sm:text-sm text-base">
      {/* Post head */}
      <div className="card-title">
        {/* Left head */}
        <span className="w-full">
          <div className="flex flex-row">
            <div role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                />
              </div>
            </div>
            <span className=" pt-2 pl-2">
              {currentPost.author.username}
              <div className="flex flex-row text-xs">
                <span className="pr-2">
                  <FaClock />
                </span>
                <span>{currentPost.createdAt?.toLocaleString()}</span>
              </div>
            </span>
          </div>
        </span>
        {/* Right head: Actions */}
        <span className=" text-right">
          <div className="dropdown dropdown-left sm:dropdown-right">
            <div tabIndex={0} role="button" className="m-1">
              ...
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52"
            >
              <li>
                <a>Edit</a>
              </li>
              <li>
                <a onClick={() => deletePost()}>Delete</a>
              </li>
              <li>
                <a>Report</a>
              </li>
            </ul>
          </div>
        </span>
      </div>
      <div className=" card-body text-lg sm:text-2xl pb-0">
        {currentPost.title}
      </div>
      <div className=" card-body text-lg">{currentPost.content}</div>
      <div className="w-full flex flex-row pt-2">
        <span className="flex w-full justify-center">
          {currentPost.likes.length}
        </span>
        <span className="flex w-full justify-center">
          {currentPost.comments.length}
        </span>
        <span className="flex w-full justify-center">
          {currentPost.shares.length}
        </span>
      </div>
      <div className="w-full flex flex-row pt-2 text-2xl">
        <span className="flex w-full justify-center">
          <div className="dropdown dropdown-hover dropdown-top">
            <span
              tabIndex={0}
              className="hover:text-primary cursor-pointer"
              // onTouchStart={() => likePost(Reactions.LIKE)}
            >
              {reaction ? (
                reaction === "HAHA" ? (
                  <FaLaugh />
                ) : reaction === "LIKE" ? (
                  <FaThumbsUp />
                ) : reaction === "LOVE" ? (
                  <FaHeart />
                ) : (
                  <FaSadCry />
                )
              ) : (
                <FaThumbsUp />
              )}
            </span>
            <div className=" flex flex-row dropdown-content z-[1] menu p-2 w-96">
              <span
                className={
                  reaction === Reactions.LIKE
                    ? "text-2xl pr-3 text-primary hover:text-3xl bg-base-200 rounded p-2"
                    : "text-2xl pr-3 text-primary hover:text-3xl p-2"
                }
                onClick={() => reactPost(Reactions.LIKE)}
                onTouchStart={() => reactPost(Reactions.LIKE)}
              >
                <FaThumbsUp />
              </span>
              <span
                className={
                  reaction === Reactions.LOVE
                    ? "text-2xl pr-3 text-error hover:text-3xl bg-base-200 rounded p-2"
                    : "text-2xl pr-3 text-error hover:text-3xl p-2"
                }
                onClick={() => reactPost(Reactions.LOVE)}
                onTouchStart={() => reactPost(Reactions.LOVE)}
              >
                <FaHeart />
              </span>
              <span
                className={
                  reaction === Reactions.HAHA
                    ? "text-2xl pr-3 text-warning hover:text-3xl bg-base-200 rounded p-2"
                    : "text-2xl pr-3 text-warning hover:text-3xl p-2"
                }
                onClick={() => reactPost(Reactions.HAHA)}
                onTouchStart={() => reactPost(Reactions.HAHA)}
              >
                <FaLaugh />
              </span>
              <span
                className={
                  reaction === Reactions.SAD
                    ? "text-2xl pr-3 text-warning hover:text-3xl bg-base-200 rounded p-2"
                    : "text-2xl pr-3 text-warning hover:text-3xl p-2"
                }
                onClick={() => reactPost(Reactions.SAD)}
                onTouchStart={() => reactPost(Reactions.SAD)}
              >
                <FaSadCry />
              </span>
            </div>
          </div>
        </span>
        <span
          className="flex w-full justify-center"
          onClick={() => setIsComment(!isComment)}
        >
          <span className="hover:text-primary cursor-pointer">
            <FaComment />
          </span>
        </span>
        <span className="flex w-full justify-center">
          <span className="hover:text-primary cursor-pointer">
            <FaShare />
          </span>
        </span>
      </div>
      <div className={isComment ? "" : "hidden"}>
        <form>
          <label>Comment</label>
          <textarea
            className="input input-bordered w-full"
            name="comment"
            id="comment_postId"
            value={comment}
            onChange={(e) => setComment(e.currentTarget.value)}
          />
          <input
            type="submit"
            className="btn btn-primary float-right mt-2"
            value="Submit"
          />
        </form>
      </div>
    </div>
  );
}

export default Post;
