import React from "react";

function FormSection({
  title,
  placeholder,
  value,
  onChange,
  options,
  type = "text",
  infoText = "" 
}) {
  return (
    <div className="flex flex-col w-full">
      <div>{title}</div>
      <div className="mt-2">
        {type === 'select' ? (
          <select className="border-2 border-borderColor rounded-md px-5 w-full max-w-full" value={value} onChange={onChange}>
            {options.map(option => (
              <option key={option._id} value={option.name}>{option.name}</option>
            ))}
          </select>
        ) : type === 'file' ? (
          <input type="file" onChange={onChange} accept="image/*" className="border-2 border-borderColor rounded-md px-5 w-full" />
        ) : (
          <input type="text" placeholder={placeholder} value={value} onChange={onChange} className="border-2 border-borderColor rounded-md px-5 w-full" />
        )}
      </div>
      {infoText && <div className="text-sm text-gray-600 mt-1">{infoText}</div>}
      
    </div>
  );
}

export default FormSection;
