"use client";

import React, { useState } from "react";

function Post() {
  const [isComment, setIsComment] = useState(false);
  const [comment, setComment] = useState("");
  return (
    <div className="card card-bordered flex flex-col text-justify p-3 sm:text-sm text-base">
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
        <button className="w-full">1K</button>
        <button className="w-full">1K</button>
        <button className="w-full">6</button>
      </div>
      <hr />
      <div className="w-full flex flex-row pt-2">
        <button className="w-full">Like</button>
        <button className="w-full" onClick={() => setIsComment(!isComment)}>
          Comment
        </button>
        <button className="w-full">Share</button>
      </div>
      <div className={isComment ? "" : "hidden"}>
        <form>
          <label>Comment</label>
          <textarea
            className="input input-bordered w-full"
            name="comment"
            id="comment_postId"
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
