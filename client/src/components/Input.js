import React from "react";

function Input({ type, placeholder, value, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="p-2 pr-8 border-2 border-gray-300 rounded-md w-full"
    />
  );
}

export default Input;
