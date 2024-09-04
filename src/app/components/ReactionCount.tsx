import { useState } from "react";
import { FaHeart, FaLaugh, FaSadCry, FaThumbsUp } from "react-icons/fa";
import Modal from "./Modal";

function ReactionCount({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <>
      <span className="cursor-pointer text-2xl">
        <FaThumbsUp />
      </span>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="row justify-between">
          <span>
            <FaThumbsUp />
          </span>
          <span>
            <FaHeart />
          </span>
          <span>
            <FaLaugh />
          </span>
          <span>
            <FaSadCry />
          </span>
        </div>
      </Modal>
    </>
  );
}
export default ReactionCount;
