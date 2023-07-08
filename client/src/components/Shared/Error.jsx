import React from "react";

const Error = ({ text, textAlign }) => {
  const errorClasses = {
    false: "",
    true: "text-align",
  };

  const errorClass = errorClasses[textAlign];
  return (
    <div className="h-xs aic flex-column jcc full-width">
      {text && <div className={`error full-width ${errorClass}`}>{text}</div>}
    </div>
  );
};

export default Error;
