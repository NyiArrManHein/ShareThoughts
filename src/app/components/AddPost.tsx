import React, { Dispatch, SetStateAction } from "react";

function AddPost({
  submitPost,
  isAddPost,
  title,
  setTitle,
  content,
  setContent,
}: {
  submitPost: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isAddPost: boolean;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
}) {
  return (
    <form onSubmit={submitPost}>
      <div
        className={
          isAddPost
            ? "card card-bordered border-base-300 flex flex-col text-justify p-3 mb-1 sm:text-sm text-base w-full"
            : "hidden"
        }
      >
        <input
          type="text"
          className="input input-ghost focus:outline-none focus:border-none w-full"
          name="title"
          id="title"
          placeholder="Title..."
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
        <textarea
          className="input input-ghost focus:outline-none focus:border-none w-full"
          name="content"
          id="content"
          placeholder="Content ..."
          value={content}
          onChange={(e) => setContent(e.currentTarget.value)}
        ></textarea>
        <div>
          <input
            type="submit"
            className="btn btn-primary w-fit float-right mt-1"
            value="Post"
          />
        </div>
      </div>
    </form>
  );
}

export default AddPost;
