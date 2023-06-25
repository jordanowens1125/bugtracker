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
}) => {
  return (
    <>
      <div className="flex-column full-width">
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
