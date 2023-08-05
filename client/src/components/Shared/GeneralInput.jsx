const Input = ({
  value,
  onChange,
  required = true,
  label,
  id,
  type = "text",
  content,
  placeholder,
  disabled = false,
  column = false,
}) => {
  let classes = "";
  if (column) {
    classes += "flex-column ";
  } else {
    classes += "flex aic";
  }

  return (
    <>
      <div className={`${classes} full-width p-sm mobile-column`}>
        <label htmlFor={label}>{label}:</label>
        <div className="flex full-width gap-0 jcc">
          <input
            type={type}
            value={value}
            required={required}
            onChange={onChange}
            id={id}
            name={id}
            className="grow"
            placeholder={placeholder}
            aria-label={label}
            disabled={disabled}
          ></input>
          {content}
        </div>
      </div>
    </>
  );
};

export default Input;
