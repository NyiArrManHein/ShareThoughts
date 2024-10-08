import { Reactions } from "@prisma/client";
import React, { useEffect, useRef } from "react";
import { FaHeart, FaLaugh, FaSadCry, FaThumbsUp } from "react-icons/fa";

function ReactionsComponent({
  showReactions,
  setShowReactions,
  reaction,
  handler,
}: {
  showReactions: boolean;
  setShowReactions: React.Dispatch<React.SetStateAction<boolean>>;
  reaction: Reactions | undefined;
  handler: (reaction: Reactions) => Promise<void>;
}) {
  const reactionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        reactionsRef.current &&
        !reactionsRef.current.contains(event.target as Node)
      ) {
        setShowReactions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <span className="flex w-full justify-center">
      {/* <span className="absolute"> */}
      <span className="absolute">
        {/* <div
          className={
            showReactions ? " flex flex-row w-full justify-center" : "hidden"
          }
          onMouseLeave={() => setShowReactions(false)}
        > */}
        {showReactions && (
          <div
            ref={reactionsRef}
            className=" flex flex-row w-full justify-center"
            onMouseLeave={() => setShowReactions(false)}
            onTouchStart={() => setShowReactions(!showReactions)}
          >
            <span
              className={
                reaction === Reactions.LIKE
                  ? "text-2xl pr-3 text-primary hover:text-3xl bg-base-200 rounded-full p-3"
                  : "text-2xl pr-3 text-primary hover:text-3xl"
              }
              onClick={() => handler(Reactions.LIKE)}
              onTouchStart={() => handler(Reactions.LIKE)}
            >
              <FaThumbsUp />
            </span>
            <span
              className={
                reaction === Reactions.LOVE
                  ? "text-2xl pr-3 text-error hover:text-3xl bg-base-200 rounded-full p-3"
                  : "text-2xl pr-3 text-error hover:text-3xl"
              }
              onClick={() => handler(Reactions.LOVE)}
              onTouchStart={() => handler(Reactions.LOVE)}
            >
              <FaHeart />
            </span>
            <span
              className={
                reaction === Reactions.HAHA
                  ? "text-2xl pr-3 text-warning hover:text-3xl bg-base-200 rounded-full p-3"
                  : "text-2xl pr-3 text-warning hover:text-3xl"
              }
              onClick={() => handler(Reactions.HAHA)}
              onTouchStart={() => handler(Reactions.HAHA)}
            >
              <FaLaugh />
            </span>
            <span
              className={
                reaction === Reactions.SAD
                  ? "text-2xl pr-3 text-warning hover:text-3xl bg-base-200 rounded-full p-3"
                  : "text-2xl pr-3 text-warning hover:text-3xl"
              }
              onClick={() => handler(Reactions.SAD)}
              onTouchStart={() => handler(Reactions.SAD)}
            >
              <FaSadCry />
            </span>
          </div>
        )}

        {/* <div className={showReactions ? "hidden" : ""}>
          <span
            tabIndex={0}
            className="hover:text-primary cursor-pointer text-2xl"
            onClick={() => setShowReactions(!showReactions)}
          > */}
        {!showReactions && (
          <div>
            <span
              tabIndex={0}
              className="hover:text-primary cursor-pointer text-2xl"
              onClick={() => setShowReactions(!showReactions)}
            >
              {reaction ? (
                reaction === "HAHA" ? (
                  <FaLaugh />
                ) : reaction === "LIKE" ? (
                  <FaThumbsUp />
                ) : reaction === "LOVE" ? (
                  <FaHeart />
                ) : (
                  <FaSadCry />
                )
              ) : (
                <FaThumbsUp />
              )}
            </span>
          </div>
        )}
      </span>
    </span>
  );
}

export default ReactionsComponent;
