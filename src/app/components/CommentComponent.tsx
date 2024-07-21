import { CommentModel } from "@/lib/models";
import React, { useState } from "react";
import ReactionsComponent from "./ReactionsComponent";
import { $Enums, CommentLike, Reactions } from "@prisma/client";

function CommentComponent({ comment }: { comment: CommentModel }) {
  const [showReactions, setShowReactions] = useState(false);
  const [reaction, setReaction] = useState<Reactions | undefined>();

  // Ensure createdAt is a Date object
  const CommentCreatedAt = new Date(comment.createdAt);
  return (
    <>
      <div className="flex flex-row pl-5">
        <div className=" flex flex-col">
          <span>
            <i>{comment?.user?.username}</i>
            <small className="pl-5">{CommentCreatedAt.toLocaleString()}</small>
          </span>
          <span className=" pl-3">{comment.content}</span>
          <div className=" w-full flex flex-row">
            <span className="pt-2 text-2xl">
              <ReactionsComponent
                showReactions={showReactions}
                setShowReactions={setShowReactions}
                reaction={reaction}
                handler={function (reaction: $Enums.Reactions): Promise<void> {
                  throw new Error("Function not implemented.");
                }}
              />
            </span>
            <span className="btn btn-ghost px-5">Reply</span>
          </div>
        </div>
        {/* ... Actions */}
        <span className="text-right">
          <div className="dropdown dropdown-left sm:dropdown-right">
            {/* <div tabIndex={0} role="button" className="m-1">
              ...
            </div> */}
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
              <li>
                <a>Report</a>
              </li>
            </ul>
          </div>
        </span>
      </div>
      <hr />
    </>
  );
}

export default CommentComponent;
