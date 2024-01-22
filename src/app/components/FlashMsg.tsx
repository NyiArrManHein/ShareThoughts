import { FlashMessage } from "@/lib/models";
import React from "react";
import { FaInfoCircle } from "react-icons/fa";

function FlashMsg({ flashMessage }: { flashMessage: FlashMessage }) {
  const categories = {
    info: "bg-info",
    error: "bg-error",
  };

  return (
    <div
      role="alert"
      className={
        flashMessage.category === categories.info
          ? "flex flex-row alert alert-info mt-2"
          : "alert alert-error mt-2"
      }
    >
      <span>
        <FaInfoCircle />
      </span>
      <span className="text-left">{flashMessage.message}</span>
    </div>
  );
}

export default FlashMsg;
