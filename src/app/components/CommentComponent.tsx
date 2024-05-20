import { CommentModel } from "@/lib/models";
import React from "react";

function CommentComponent({ comment }: { comment: CommentModel }) {
  return (
    <div className="flex flex-col pl-5">
      <div className=" flex flex-col">
        <span>
          <i>{comment?.user?.username}</i>
          <small className="pl-5">Feb-15, 2024</small>
        </span>
        <span className=" pl-3">{comment.content}</span>
        <span>
          <span className=" btn btn-ghost pl-3">Like</span>
          <span className=" btn btn-ghost pl-3">Reply</span>
        </span>
      </div>
    </div>
  );
}

export default CommentComponent;
