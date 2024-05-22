"use client";

import { PostModel } from "@/lib/models";
import { Like, Reactions } from "@prisma/client";
import { CommentModel } from "@/lib/models";
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
import CommentComponent from "./CommentComponent";
import ReactionsComponent from "./ReactionsComponent";

function Post({
  post,
  userId,
  deletePostFromTheList,
}: {
  post: PostModel;
  userId?: number;
  deletePostFromTheList: (postId: number) => void;
}) {
  // States
  const [currentPost, setCurrentPost] = useState(post);
  const [showReactions, setShowReactions] = useState(false);
  const [reaction, setReaction] = useState<Reactions | undefined>(
    currentPost.likes.filter((like) => like.userId === userId)[0]?.reaction
  );
  const [commentController, setCommentController] = useState("");
  const [comments, setComments] = useState<CommentModel[]>([]);

  /**
   * Reacting the Post
   * @param reaction
   */
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
    setShowReactions(!showReactions);
  };

  /**
   * Delete Post
   */
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

  /**
   *
   * @param e
   */
  const commentPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
      postId: currentPost.id,
      commentContent: commentController,
    };
    const res = await fetch("/api/posts/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      // Receive Data from server
      const { comment, message }: { comment: CommentModel; message: string } =
        await res.json();
      if (comment) {
        currentPost.comments.push(comment);
        setComments([...comments, comment]);
        setCommentController("");
      } else {
        alert(message);
      }
    }
  };

  /**
   * Show Comment Modal
   */
  const showCommentModal = async () => {
    const res = await fetch(`/api/posts/comment?postId=${post.id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const { comments, message } = await res.json();
      setComments(comments);
    } else {
      alert("Connection failed.");
    }
    console.log(comments);
    // @ts-ignore
    document.getElementById(`comment_modal_${currentPost.id}`)!.showModal();
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
        <ReactionsComponent
          showReactions={showReactions}
          setShowReactions={setShowReactions}
          reaction={reaction}
          handler={reactPost}
        />
        <span
          className="flex w-full justify-center"
          onClick={() => showCommentModal()}
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
      {/* Comment Section */}
      <dialog id={"comment_modal_" + post.id} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Comment Section</h3>
          <div className="py-4">
            <span className="flex flex-col">
              {comments.map((_comment) => (
                <CommentComponent
                  key={"commentId" + _comment.id}
                  comment={_comment}
                />
              ))}
            </span>
            <form onSubmit={commentPost}>
              <label>Comment</label>
              <textarea
                className="input input-bordered w-full"
                name="commentContent"
                id="commentContent"
                value={commentController}
                onChange={(e) => setCommentController(e.currentTarget.value)}
              />
              <input
                type="submit"
                className="btn btn-primary float-right mt-2"
                value="Submit"
              />
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default Post;
