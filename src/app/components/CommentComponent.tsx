import { CommentModel } from "@/lib/models";
import React, { useState } from "react";
import ReactionsComponent from "./ReactionsComponent";
import { $Enums, Reactions } from "@prisma/client";

function CommentComponent({ comment }: { comment: CommentModel }) {
  const [showReactions, setShowReactions] = useState(false);
  const [reaction, setReaction] = useState<Reactions | undefined>(
    Reactions.HAHA
  );
  return (
    <div className="flex flex-col pl-5">
      <div className=" flex flex-col">
        <span>
          <i>{comment?.user?.username}</i>
          <small className="pl-5">Feb-15, 2024</small>
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
    </div>
  );
}

export default CommentComponent;
