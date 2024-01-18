import { FlashMessage } from "@/lib/models";
import React from "react";

function FlashMsg({ flashMessage }: { flashMessage: FlashMessage }) {
  const categories = {
    info: "bg-info",
    error: "bg-error",
  };

  return (
    <div
      className={
        flashMessage.category === categories.info
          ? " text text-black bg-info rounded p-3"
          : " text text-black bg-error rounded p-3"
      }
    >
      {flashMessage.message}
    </div>
  );
}

export default FlashMsg;
