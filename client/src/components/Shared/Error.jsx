import React from "react";

const Error = ({ text, textAlign, fullWidth}) => {
  const errorClasses = {
    false: "",
    true: "text-align",
  };

  let errorClass = errorClasses[textAlign];

  const widthClasses = {
    false: "",
    true: "full-width",
  };
  let widthClass = widthClasses[fullWidth];

  return (
    <div className={`h-xs flex-column jcc ${widthClass}`}>
      {text && (
        <div className={`error ${widthClass} ${errorClass}`}>{text}</div>
      )}
    </div>
  );
};

export default Error;
