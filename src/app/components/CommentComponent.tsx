import { CommentModel } from "@/lib/models";
import React, { useEffect, useState } from "react";
import ReactionsComponent from "./ReactionsComponent";
import { $Enums, CommentLike, Reactions } from "@prisma/client";
import useUser from "@/lib/useUser";

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
  // const [reaction, setReaction] = useState<Reactions | undefined>(
  //   comment.commentlikes.filter((like) => like.userId === userId)[0]?.reaction
  // );
  const [reaction, setReaction] = useState<Reactions | undefined>();

  // const [reaction, setReaction] = useState<Reactions | undefined>(() => {
  //   if (Array.isArray(comment.commentlikes)) {
  //     return comment.commentlikes.find((like) => like.userId === userId)
  //       ?.reaction;
  //   }
  //   return undefined;
  // });

  const [isThereReaction, setIsThereReaction] = useState<
    CommentLike | undefined
  >();

  // Ensure createdAt is a Date object
  const CommentCreatedAt = new Date(comment.createdAt);

  // const reactComment = async (userReaction: Reactions) => {
  //   if (userId) {
  //     const data = {
  //       commentId: comment.id,
  //       reactionType: userReaction,
  //     };
  //     const res = await fetch("api/posts/comment/react", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     });
  //     if (res.ok) {
  //       const {
  //         react,
  //         message,
  //       }: { react: CommentLike | undefined; message: string } =
  //         await res.json();
  //       // if (react) {
  //       //   const isThereReaction = comment.commentlikes.filter(
  //       //     (like) => like.userId === react.userId && like.reaction === reaction
  //       //   )[0];
  //       //   const reactedComment = comment.commentlikes.filter(
  //       //     (like) => like.userId !== react.userId
  //       //   );
  //       //   comment.commentlikes = reactedComment;
  //       //   if (isThereReaction === undefined) {
  //       //     comment.commentlikes.push(react);
  //       //     setReaction(reaction);
  //       //   } else {
  //       //     setReaction(undefined);
  //       //   }
  //       // } else {
  //       //   alert(message);
  //       // }
  //       if (react) {
  //         setReaction(reaction);
  //       }
  //     }
  //   }
  //   setShowReactions(!showReactions);
  // };

  useEffect(() => {
    const fetchReaction = async () => {
      const res = await fetch(
        `api/posts/comment/react?commentId=${comment.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        const {
          react,
          message,
        }: { react: CommentLike | undefined; message: string } =
          await res.json();
        console.log("Fetched reaction:", react);
        if (react) {
          setReaction(react.reaction);
          // setIsThereReaction(
          //   comment.commentlikes.filter(
          //     (like) =>
          //       like.userId === react.userId && like.reaction === react.reaction
          //   )[0]
          // );

          console.log("useEffectReaction", reaction);
          console.log("useEffectCommentLike", reaction);
        } else {
          alert("error reaction");
          console.error("Failed to fetch reaction:", await res.json());
        }
      }
    };
    fetchReaction();
  }, [comment.id]);

  // useEffect(() => {
  //   if (Array.isArray(comment.commentlikes)) {
  //     const userReaction = comment.commentlikes.find(
  //       (like) => like.userId === userId
  //     );
  //     if (userReaction) {
  //       setReaction(userReaction.reaction);
  //     }
  //   }
  // }, [comment.commentlikes, userId]);

  const reactComment = async (userReaction: Reactions) => {
    if (userId) {
      const data = {
        commentId: comment.id,
        reactionType: userReaction,
      };
      const res = await fetch("api/posts/comment/react", {
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
        }: { react: CommentLike | undefined; message: string } =
          await res.json();

        if (react) {
          // Ensure comment.commentlikes is defined and is an array
          if (Array.isArray(comment.commentlikes)) {
            // const isThereReaction = comment.commentlikes.filter(
            //   (like) =>
            //     like.userId === react.userId && like.reaction === userReaction
            // )[0];

            setIsThereReaction(
              comment.commentlikes.filter(
                (like) =>
                  like.userId === react.userId && like.reaction === userReaction
              )[0]
            );

            const reactedComment = comment.commentlikes.filter(
              (like) => like.userId !== react.userId
            );

            comment.commentlikes = reactedComment;

            if (isThereReaction === undefined) {
              comment.commentlikes.push(react);
              setReaction(userReaction);
            } else {
              setReaction(undefined);
            }
          } else {
            // Handle case where comment.commentlikes is not an array or undefined
            comment.commentlikes = [react];
            setReaction(userReaction);
          }
        } else {
          alert(message);
        }
      }
    }
    setShowReactions(!showReactions);
  };

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
              {/* <ReactionsComponent
                showReactions={showReactions}
                setShowReactions={setShowReactions}
                reaction={reaction}
                handler={reactComment}
              /> */}
            </span>
            {/* <span className="btn btn-ghost px-5">Reply</span> */}
            <span
              className="btn btn-ghost px-5"
              onClick={() => onEdit(comment)}
            >
              Edit
            </span>
            <span
              className="btn btn-ghost px-5"
              onClick={() => onDelete(comment.id)}
            >
              Delete
            </span>
            <ReactionsComponent
              showReactions={showReactions}
              setShowReactions={setShowReactions}
              reaction={reaction}
              handler={reactComment}
            />
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
              {/* <li>
                <a>Report</a>
              </li> */}
            </ul>
          </div>
        </span>
      </div>
      <hr />
    </>
  );
}

export default CommentComponent;
