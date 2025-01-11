import React from "react";
import { CgClose } from "react-icons/cg";

const Modal = ({ id, title, children }) => {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            <CgClose className="text-2xl" />
          </button>
        </form>
        {title && <h3 className="font-bold text-2xl">{title}</h3>}
        <div className="py-4">{children}</div>
      </div>
    </dialog>
  );
};

export default Modal;
