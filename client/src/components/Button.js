import React from "react";

function Button({ onClick, text }) {
  return (
    <button
      onClick={onClick}
      className="border-borderColor border-2  rounded-lg w-full"
    >
      {text}
    </button>
  );
}
export default Button;
