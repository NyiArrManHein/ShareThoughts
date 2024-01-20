"use client";

import React, { useState } from "react";
import { FaComment, FaShare, FaThumbsUp } from "react-icons/fa";

function Post() {
  const [isComment, setIsComment] = useState(false);
  const [comment, setComment] = useState("");
  return (
    <div className="card card-bordered border-base-300 flex flex-col text-justify p-3 mb-1 sm:text-sm text-base">
      <div className="card-title">
        <h2>Title</h2>
        <small>#2024</small>
        <span className=" text-right w-full ">
          <div className="dropdown">
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
                <a>Delete</a>
              </li>
              <li>
                <a>Report</a>
              </li>
            </ul>
          </div>
        </span>
      </div>
      <div>Jan 18, 24</div>
      <div className=" card-body">
        Learn how to form, develop, and express your ideas in paragraphs. Find
        out what a paragraph is, how to decide what to put in it, and how to
        organize it with different techniques. See a 5-step example of how to
        write an illustration paragraph that supports your thesis with examples.
      </div>
      <div className="w-full flex flex-row pt-2">
        <span className="flex w-full justify-center">1K</span>
        <span className="flex w-full justify-center">1K</span>
        <span className="flex w-full justify-center">6</span>
      </div>
      <div className="w-full flex flex-row pt-2">
        <span className="flex w-full justify-center">
          <FaThumbsUp />
        </span>
        <span
          className="flex w-full justify-center"
          onClick={() => setIsComment(!isComment)}
        >
          <FaComment />
        </span>
        <span className="flex w-full justify-center">
          <FaShare />
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
