const Input = ({
  value,
  onChange,
  required = true,
  label,
  id,
  type = "text",
  content,
  placeholder,
}) => {
  return (
    <>
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
        ></input>
        {content}
      </div>
    </>
  );
};

export default Input;
