import {
  commentLikeWithUser,
  CommentModel,
  ReactionCounts,
} from "@/lib/models";
import React, { useEffect, useState } from "react";
import ReactionsComponent from "./ReactionsComponent";
import { $Enums, CommentLike, Reactions } from "@prisma/client";
import useUser from "@/lib/useUser";
import { FaHeart, FaLaugh, FaSadCry, FaThumbsUp } from "react-icons/fa";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Image from "next/image";
import profilePic from "../img/profile.webp";
import { useRouter } from "next/navigation";

function CommentComponent({
  comment,
  userId,
  onDelete,
  onEdit,
}: {
  comment: CommentModel;
  userId?: number;
  onDelete: (id: number) => void;
  onEdit: (comment: CommentModel) => void;
}) {
  const [showReactions, setShowReactions] = useState(false);
  const [reaction, setReaction] = useState<Reactions | undefined>(
    comment?.commentLikes?.filter((like) => like.userId === userId)[0]?.reaction
  );

  const CommentCreatedAt = new Date(comment.createdAt);
  const reactionCounts = comment.commentLikes.reduce<Partial<ReactionCounts>>(
    (acc, like) => {
      const reaction = like.reaction as keyof ReactionCounts;
      acc[reaction] = (acc[reaction] || 0) + 1;
      return acc;
    },
    {}
  );

  const router = useRouter();

  const profileViewAction = (id: number) => {
    router.push(`/profileView/${id}`);
  };

  const reactComment = async (userReaction: Reactions) => {
    if (userId) {
      const data = {
        commentId: comment.id,
        reactionType: userReaction,
      };
      const res = await fetch("/api/posts/comment/react", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const {
          react,
          message,
        }: { react: commentLikeWithUser | undefined; message: string } =
          await res.json();

        if (react) {
          // Ensure comment.commentlikes is defined and is an array

          const isThereReaction = comment.commentLikes.filter(
            (like) =>
              like.userId === react.userId && like.reaction === userReaction
          )[0];

          const reactedComment = comment.commentLikes.filter(
            (like) => like.userId !== react.userId
          );

          comment.commentLikes = reactedComment;

          if (isThereReaction === undefined) {
            comment.commentLikes.push(react);
            setReaction(userReaction);
          } else {
            setReaction(undefined);
          }
        } else {
          alert(message);
        }
      }
    }
    setShowReactions(!showReactions);
  };

  const reactionCountModal = () => {
    const modal = document.getElementById(
      `reaction_modal_${comment.id}`
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  return (
    <>
      <div className="flex flex-row pl-5">
        <div className=" flex flex-col">
          <div className="flex flex-col">
            <span>
              <i>{comment?.user?.username}</i>
              <small className="pl-5">
                {CommentCreatedAt.toLocaleString()}
              </small>
              {/* ... Actions */}
              {/* <span className="text-right">
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
                      <a onClick={() => {}}>Delete</a>
                    </li>
                  </ul>
                </div>
              </span> */}
            </span>
            <span className=" pl-3">{comment.content}</span>

            <div
              className="flex flex-row items-center cursor-pointer text-2xl mt-5"
              onClick={reactionCountModal}
            >
              <FaThumbsUp />
              <FaHeart />
              <div className="text-sm ms-2">{comment.commentLikes.length}</div>
            </div>
          </div>
          <div className=" w-full flex flex-row mt-5 pb-5">
            {/* <span className="btn btn-ghost px-5">Reply</span> */}

            <div className="ms-10 mt-5">
              <ReactionsComponent
                showReactions={showReactions}
                setShowReactions={setShowReactions}
                reaction={reaction}
                handler={reactComment}
              />
            </div>
            <span
              className="btn btn-ghost ms-5 mt-2"
              onClick={() => onEdit(comment)}
            >
              Edit
            </span>
            <span
              className="btn btn-ghost mt-2"
              onClick={() => onDelete(comment.id)}
            >
              Delete
            </span>
          </div>
        </div>
      </div>
      <hr />
      <dialog id={"reaction_modal_" + comment.id} className="modal">
        <div className="modal-box relative h-[500px]">
          <div className="w-full max-w-md px-2 sm:px-0">
            <TabGroup>
              <TabList className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                <Tab className="w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 data-[selected]:bg-blue-500 data-[selected]:text-white">
                  All
                </Tab>
                <Tab className="w-full flex justify-center items-center rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 data-[selected]:bg-blue-500 data-[selected]:text-white">
                  <div className="text-2xl mr-2">
                    <FaThumbsUp />
                  </div>
                  <div>{reactionCounts.LIKE || 0}</div>
                </Tab>
                <Tab className="w-full flex justify-center items-center rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 data-[selected]:bg-blue-500 data-[selected]:text-white">
                  <div className="text-2xl mr-2">
                    <FaHeart />
                  </div>
                  <div>{reactionCounts.LOVE || 0}</div>
                </Tab>
                <Tab className="w-full flex justify-center items-center rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 data-[selected]:bg-blue-500 data-[selected]:text-white">
                  <div className="text-2xl mr-2">
                    <FaLaugh />
                  </div>
                  <div>{reactionCounts.HAHA || 0}</div>
                </Tab>
                <Tab className="w-full flex justify-center items-center rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 data-[selected]:bg-blue-500 data-[selected]:text-white">
                  <div className="text-2xl mr-2">
                    <FaSadCry />
                  </div>
                  <div>{reactionCounts.SAD || 0}</div>
                </Tab>
              </TabList>
              <TabPanels className="mt-2">
                <TabPanel>
                  {comment.commentLikes.map((like, index) => (
                    <div
                      className="flex flex-row items-center cursor-pointer"
                      key={index}
                      onClick={() => profileViewAction(like.user.id)}
                    >
                      <div
                        role="button"
                        className="btn btn-ghost btn-circle avatar"
                      >
                        <div className="w-8 rounded-full">
                          <Image
                            src={profilePic}
                            alt="Profile Picture"
                            width={50}
                            height={50}
                          />
                        </div>
                      </div>
                      <div key={like.id}>{like.user.username}</div>
                    </div>
                  ))}
                </TabPanel>
                <TabPanel>
                  {comment.commentLikes
                    .filter((like) => like.reaction === Reactions.LIKE)
                    .map((like, index) => (
                      <div
                        className="flex flex-row items-center cursor-pointer"
                        key={index}
                        onClick={() => profileViewAction(like.user.id)}
                      >
                        <div
                          role="button"
                          className="btn btn-ghost btn-circle avatar"
                        >
                          <div className="w-8 rounded-full">
                            <Image
                              src={profilePic}
                              alt="Profile Picture"
                              width={50}
                              height={50}
                            />
                          </div>
                        </div>
                        <div key={like.id}>{like.user.username}</div>
                      </div>
                    ))}
                </TabPanel>
                <TabPanel>
                  {comment.commentLikes
                    .filter((like) => like.reaction === Reactions.LOVE)
                    .map((like, index) => (
                      <div
                        className="flex flex-row items-center cursor-pointer"
                        key={index}
                        onClick={() => profileViewAction(like.user.id)}
                      >
                        <div
                          role="button"
                          className="btn btn-ghost btn-circle avatar"
                        >
                          <div className="w-8 rounded-full">
                            <Image
                              src={profilePic}
                              alt="Profile Picture"
                              width={50}
                              height={50}
                            />
                          </div>
                        </div>
                        <div key={like.id}>{like.user.username}</div>
                      </div>
                    ))}
                </TabPanel>
                <TabPanel>
                  {comment.commentLikes
                    .filter((like) => like.reaction === Reactions.HAHA)
                    .map((like, index) => (
                      <div
                        className="flex flex-row items-center cursor-pointer"
                        key={index}
                        onClick={() => profileViewAction(like.user.id)}
                      >
                        <div
                          role="button"
                          className="btn btn-ghost btn-circle avatar"
                        >
                          <div className="w-8 rounded-full">
                            <Image
                              src={profilePic}
                              alt="Profile Picture"
                              width={50}
                              height={50}
                            />
                          </div>
                        </div>
                        <div key={like.id}>{like.user.username}</div>
                      </div>
                    ))}
                </TabPanel>
                <TabPanel>
                  {comment.commentLikes
                    .filter((like) => like.reaction === Reactions.SAD)
                    .map((like, index) => (
                      <div
                        className="flex flex-row items-center cursor-pointer"
                        key={index}
                        onClick={() => profileViewAction(like.user.id)}
                      >
                        <div
                          role="button"
                          className="btn btn-ghost btn-circle avatar"
                        >
                          <div className="w-8 rounded-full">
                            <Image
                              src={profilePic}
                              alt="Profile Picture"
                              width={50}
                              height={50}
                            />
                          </div>
                        </div>
                        <div key={like.id}>{like.user.username}</div>
                      </div>
                    ))}
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className="absolute inset-0 w-full h-full bg-black opacity-30"></button>
        </form>
      </dialog>
    </>
  );
}

export default CommentComponent;
