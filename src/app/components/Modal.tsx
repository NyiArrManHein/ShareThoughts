// components/PostModal.tsx
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <dialog className="modal" open>
      <div className="modal-box relative">{children}</div>
      <form method="dialog" className="modal-backdrop">
        <button
          onClick={onClose}
          className="absolute inset-0 w-full h-full bg-black opacity-30"
        ></button>
      </form>
    </dialog>
  );
};
export default Modal;
