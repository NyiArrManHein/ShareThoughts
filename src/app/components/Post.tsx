import React from "react";

function Post() {
  return (
    <div className="card card-bordered flex flex-col text-justify p-3 sm:text-sm text-base">
      <div className="card-title">
        <h2>Title</h2>
        <small>#2024</small>
        <span className=" text-right w-full ">...</span>
      </div>
      <div>Jan 18, 24</div>
      <div className=" card-body">
        Learn how to form, develop, and express your ideas in paragraphs. Find
        out what a paragraph is, how to decide what to put in it, and how to
        organize it with different techniques. See a 5-step example of how to
        write an illustration paragraph that supports your thesis with examples.
      </div>
      <hr />
      <div className="w-full flex flex-row pt-2">
        <button className="w-full">1K</button>
        <button className="w-full">1K</button>
        <button className="w-full">6</button>
      </div>
      <div className="w-full flex flex-row">
        <button className="w-full">Like</button>
        <button className="w-full">Comment</button>
        <button className="w-full">Share</button>
      </div>
    </div>
  );
}

export default Post;
