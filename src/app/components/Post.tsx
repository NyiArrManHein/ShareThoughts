"use client";

import { PostModel, PostType } from "@/lib/models";
import { Like, Reactions } from "@prisma/client";
import { CommentModel } from "@/lib/models";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaClipboard, FaClock, FaComment, FaShare } from "react-icons/fa";
import CommentComponent from "./CommentComponent";
import ReactionsComponent from "./ReactionsComponent";
import Image from "next/image";
import profilePic from "../img/profile.webp";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Modal from "./Modal";

function Post({
  post,
  userId,
  deletePostFromTheList,
  updatePostFromTheList,
}: {
  post: PostModel;
  userId?: number;
  deletePostFromTheList: (postId: number) => void;
  updatePostFromTheList: (
    postId: number,
    title: string,
    content: string,
    hashtags: string,
    postType: PostType
  ) => void;
}) {
  // States
  const [currentPost, setCurrentPost] = useState(post);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [editPostType, setEditPostType] = useState<PostType>(post.postType);
  const [isReported, setIsReported] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [reaction, setReaction] = useState<Reactions | undefined>(
    currentPost.likes.filter((like) => like.userId === userId)[0]?.reaction
  );

  const [commentController, setCommentController] = useState("");
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // const [editingComment, setEditingComment] = useState<string>("");
  const [editingComment, setEditingComment] = useState<{
    id: number | null;
    content: string;
  }>({
    id: null,
    content: "",
  });

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  };
  const router = useRouter();
  const shareUrl = `${window.location.origin}/sharePostView/${post.id}`;

  useEffect(() => {
    setCurrentPost(post);
  }, [post]);

  useEffect(() => {
    const checkIfReported = async () => {
      const res = await fetch(`/api/posts/report?postId=${currentPost.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setIsReported(data.isReported);
    };

    checkIfReported();
  }, [currentPost.id]);

  /**
   * Reacting the Post
   * @param reaction
   */

  const handleClick = () => {
    // Navigate to the desired page
    router.push(`/profileView/${post.authorId}`);
  };

  const reactPost = async (reaction: Reactions) => {
    if (userId) {
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

  // Edit Post
  const submitEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate title to prevent hashtags
    const hashtagRegex = /#\w+/g;
    if (hashtagRegex.test(editTitle)) {
      alert("Hashtags are not allowed in the title. Please remove them.");
      return;
    }

    const data = {
      postId: currentPost.id,
      postTitle: editTitle,
      postContent: editContent,
      postType: editPostType,
    };
    const res = await fetch("/api/posts/", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const { isEdited, updatedPost, message } = await res.json();
      // updatePostFromTheList(post.id, updatedPost.title, updatedPost.content);
      // const modal = document.getElementById(
      //   `edit_modal_${post.id}`
      // ) as HTMLDialogElement | null;
      // if (modal) {
      //   modal.close();
      // }
      if (isEdited) {
        updatePostFromTheList(
          post.id,
          updatedPost.title,
          updatedPost.content,
          updatedPost.hashtags,
          updatedPost.postType
        );
        const modal = document.getElementById(
          `edit_modal_${post.id}`
        ) as HTMLDialogElement | null;
        if (modal) {
          modal.close();
        }
      } else {
        alert(message);
      }
    }
  };

  /**
   * Delete Post
   */
  const deletePost = async () => {
    // Added code
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!isConfirmed) {
      return; // If the user cancels, exit the function
    }
    // End added code
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

  // Report Post
  const reportPost = async () => {
    // Added code
    const isConfirmed = window.confirm(
      "Are you sure you want to report this post?"
    );

    if (!isConfirmed) {
      return; // If the user cancels, exit the function
    }
    // End added code
    const data = {
      postId: currentPost.id,
    };
    const res = await fetch("/api/posts/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const { isReported, message } = await res.json();
      if (isReported) {
        setIsReported(true);
        alert(message);
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

  const deleteComment = async (id: number) => {
    const data = {
      commentId: id,
    };
    const res = await fetch("/api/posts/comment/", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const { isDeleted, message }: { isDeleted: boolean; message: string } =
        await res.json();
      if (isDeleted) {
        const newComments = comments.filter((comment) => comment.id !== id);
        setComments(newComments);
        currentPost.comments = currentPost.comments.filter(
          (comment) => comment.id !== id
        );
      } else {
        alert(message);
      }
    }
  };

  const handleEditComment = (comment: CommentModel) => {
    setEditingComment({
      id: comment.id,
      content: comment.content,
    });
    setIsModalOpen(true); // Open the modal
  };

  const commentEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      commentId: editingComment.id,
      commentContent: editingComment.content,
    };
    const res = await fetch("api/posts/comment", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const { isEdited, updatedComment, message } = await res.json();
      if (isEdited) {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === updatedComment.id
              ? {
                  ...comment,
                  content: updatedComment.content,
                }
              : comment
          )
        );
        setIsModalOpen(false);
      } else {
        alert(message);
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000); // Hide the message after 2 seconds
      })
      .catch((error) => {
        console.error("Error copying link:", error);
      });
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
      // Convert createdAt to Date object for each comment
      const formattedComments = comments.map((comment: CommentModel) => ({
        ...comment,
        createdAt: new Date(comment.createdAt),
      }));
      setComments(formattedComments);
      // setComments(comments);
    } else {
      alert("Connection failed.");
    }

    // @ts-ignore
    document.getElementById(`comment_modal_${currentPost.id}`)!.showModal();
  };

  const onCloseCommentModal = () => {
    setIsModalOpen(false);
    const commentModal = document.getElementById(
      "comment_modal_" + post.id
    ) as HTMLDialogElement;
    commentModal?.close();
  };

  const showEditModal = async () => {
    const modal = document.getElementById(
      `edit_modal_${currentPost.id}`
    ) as HTMLDialogElement | null;
    if (modal) {
      const hashtagsString = currentPost.hashtags
        ? ` ${currentPost.hashtags
            .split(",")
            // .map((tag) => `#${tag}`)
            .map((tag) => `${tag}`)
            .join(" ")}`
        : "";
      setEditContent(currentPost.content + hashtagsString);
      modal.showModal();
    }
  };

  // const formatHashtags = (hashtags: string) => {
  //   return hashtags.split(",").map((tag, index) => (

  //     <Link key={index} href={`/hashtags/${tag}`}>
  //       {/* <span className="text-blue-600 cursor-pointer">#{tag} </span> */}
  //       <span className="text-blue-600 cursor-pointer">{tag} </span>
  //     </Link>
  //   ));
  // };

  const formatHashtags = (hashtags: string) => {
    return hashtags.split(",").map((tag, index) => {
      const encodedTag = encodeURIComponent(tag);
      return (
        <Link key={index} href={`/hashtags/${encodedTag}`}>
          <span className="text-blue-600 cursor-pointer">{tag} </span>
        </Link>
      );
    });
  };

  return (
    <div className="card card-bordered border-base-300 flex flex-col text-justify p-3 mb-1 sm:text-sm text-base">
      {/* Post head */}
      <div className="card-title">
        {/* Left head */}
        <span className="w-full">
          <div className="flex flex-row">
            <div
              role="button"
              className="btn btn-ghost btn-circle avatar"
              onClick={handleClick}
            >
              <div className="w-10 rounded-full">
                {/* <img
                  alt="Tailwind CSS Navbar component"
                  src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                /> */}
                <Image
                  src={profilePic}
                  alt="Profile Picture"
                  width={50}
                  height={50}
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
                <a onClick={() => showEditModal()}>Edit</a>
              </li>
              <li>
                <a onClick={() => deletePost()}>Delete</a>
              </li>
              {/* <li>
                <a onClick={() => reportPost()}>Report</a>
              </li> */}
              {/* <li>
                <a
                  onClick={() => {
                    if (!isReported) {
                      reportPost();
                    }
                  }}
                  className={
                    isReported ? "text-gray-500 cursor-not-allowed" : ""
                  }
                  style={isReported ? { pointerEvents: "none" } : {}}
                >
                  {isReported ? "Reported" : "Report"}
                </a>
              </li> */}
              <li>
                {currentPost.author.id !== userId && (
                  <a
                    onClick={() => {
                      if (!isReported) {
                        reportPost();
                      }
                    }}
                    className={
                      isReported ? "text-gray-500 cursor-not-allowed" : ""
                    }
                    style={isReported ? { pointerEvents: "none" } : {}}
                  >
                    {isReported ? "Reported" : "Report"}
                  </a>
                )}
              </li>
            </ul>
          </div>
        </span>
      </div>
      <div className=" card-body text-lg sm:text-2xl pb-0">
        {currentPost.title}
      </div>
      <div className=" card-body text-lg whitespace-pre-line overflow-auto">
        {currentPost.content}
      </div>
      <div className="mb-4">
        {currentPost.hashtags && formatHashtags(currentPost.hashtags)}
      </div>

      <div className="w-full flex flex-row pt-2">
        <span className="flex w-full justify-center">
          {currentPost.likes.length}
        </span>
        <span className="flex w-full justify-center">
          {currentPost.comments.length}
        </span>
        <span className="flex w-full justify-center">
          {/* {currentPost.shares.length} */}
          {copied && (
            <span className="bg-gray-200 text-black px-2 py-1 rounded">
              Copied
            </span>
          )}
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
          <span
            className="hover:text-primary cursor-pointer"
            onClick={handleCopyLink}
          >
            <FaShare />
          </span>
        </span>
      </div>
      {/* Comment Section */}
      <dialog id={"comment_modal_" + post.id} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Comment Section</h3>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <form onSubmit={commentEdit}>
              <textarea
                className="input input-ghost focus:outline-none focus:border-none w-full"
                name="commentContent"
                id="commentContent"
                value={editingComment.content}
                onChange={(e) =>
                  setEditingComment({
                    ...editingComment,
                    content: e.target.value,
                  })
                }
              />
              <input
                className="btn btn-primary w-fit float-right mt-1"
                type="submit"
                value="Edit"
              ></input>
            </form>
          </Modal>
          <div className="py-4">
            <span className="flex flex-col">
              {comments.map((_comment) => (
                <CommentComponent
                  key={"commentId" + _comment.id}
                  comment={_comment}
                  userId={userId}
                  onDelete={deleteComment}
                  onEdit={handleEditComment}
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
              {/* Fixed here */}
              {/* <input
                type="submit"
                className="btn btn-primary float-right mt-2"
                value="Submit"
              /> */}
              {commentController.trim() === "" ? null : (
                <input
                  type="submit"
                  className="btn btn-primary float-right mt-2"
                  value="Submit"
                />
              )}
            </form>
          </div>
        </div>
        <form
          method="dialog"
          className="modal-backdrop"
          onClick={onCloseCommentModal}
        >
          <button>close</button>
        </form>
      </dialog>

      {/* Edit Section */}
      <dialog id={"edit_modal_" + post.id} className="modal">
        <div className="modal-box">
          <form onSubmit={submitEdit}>
            <input
              className="input input-ghost focus:outline-none focus:border-none w-full"
              id="title"
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.currentTarget.value)}
              name="title"
            />
            <textarea
              className="input input-ghost focus:outline-none focus:border-none w-full"
              name="content"
              id="content"
              value={editContent}
              onChange={(e) => setEditContent(e.currentTarget.value)}
            ></textarea>
            <select
              id="postType"
              value={editPostType}
              onChange={(e) => setEditPostType(e.target.value as PostType)}
              className="input input-ghost focus:outline-none focus:border-none w-full"
            >
              <option value={PostType.PUBLIC}>Public</option>
              <option value={PostType.PRIVATE}>Private</option>
              <option value={PostType.ONLYME}>Only Me</option>
            </select>
            {editTitle && editContent && (
              <input
                className="btn btn-primary w-fit float-right mt-1"
                type="submit"
                value="Edit"
              ></input>
            )}
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default Post;
