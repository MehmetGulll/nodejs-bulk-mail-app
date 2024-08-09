import React from "react";

function Button({ onClick, text }) {
  return (
    <button
      onClick={onClick}
      className="mt-5 border-2 px-8 border-slate-700 rounded-md px-5"
    >
      {text}
    </button>
  );
}
export default Button;
