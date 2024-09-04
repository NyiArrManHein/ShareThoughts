import { PostType } from "@/lib/models";
import React, { Dispatch, SetStateAction } from "react";

function AddPost({
  submitPost,
  isAddPost,
  hideAddPost,
  title,
  setTitle,
  content,
  setContent,
  postType,
  setPostType,
}: {
  submitPost: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isAddPost: boolean;
  hideAddPost: () => void;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  postType: string;
  // setPostType: Dispatch<SetStateAction<string>>;
  setPostType: Dispatch<SetStateAction<PostType>>;
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
        <div className="flex justify-end">
          <button className="w-4" type="button" onClick={hideAddPost}>
            X
          </button>
        </div>

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
          <label htmlFor="postType">Post Type:</label>
          <select
            id="postType"
            value={postType}
            onChange={(e) => setPostType(e.target.value as PostType)}
          >
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
            <option value="ONLYME">Only Me</option>
          </select>
        </div>
        <div>
          {/* Fixed here */}
          {/* <input
            type="submit"
            className="btn btn-primary w-fit float-right mt-1"
            value="Post"
          /> */}
          {title && content && (
            <input
              type="submit"
              className="btn btn-primary w-fit float-right mt-1"
              value="Post"
            />
          )}
        </div>
      </div>
    </form>
  );
}

export default AddPost;
