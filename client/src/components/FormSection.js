import React from "react";
import Button from "./Button";


function FormSection({
  title,
  placeholder,
  value,
  onChange,
  options,
  type = "text",
  buttonAction,
  buttonText
}) {
  return (
    <div className="flex flex-col">
      <div>{title}</div>
      <div className="mt-2">
        {type === 'select' ? (
          <select className="border-2 border-slate-700 rounded-md px-5" value={value} onChange={onChange}>
            {options.map(option => (
              <option key={option._id} value={option.name}>{option.name}</option>
            ))}
          </select>
        ) : type === 'file' ? (
          <input type="file" onChange={onChange} accept="image/*" className="border-2 border-slate-700 rounded-md px-5" />
        ) : (
          <input type="text" placeholder={placeholder} value={value} onChange={onChange} className="border-2 border-slate-700 rounded-md px-5" />
        )}
      </div>
      <Button onClick={buttonAction} text={buttonText} />
    </div>
  );
}

export default FormSection;
