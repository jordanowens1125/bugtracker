const TextArea = ({
  value,
  onChange,
  placeholder,
  required = true,
  label,
  id,
  disabled,
}) => {
  return (
    <div className="flex-column full-width">
      <label htmlFor={id || label}>{label}:</label>
      <textarea
        id={id}
        name={id}
        rows="5"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
    </div>
  );
};

export default TextArea;
