const Select = ({
  label,
  value,
  onChange,
  listofOptions,
  id,
  disabled,
  required = true,
  placeholder,
  disablePlaceholder = false,
  column = false,
  contentWidth = false,
}) => {
  let classes = "";
  if (column) {
    classes += "flex-column ";
  } else {
    classes += "flex aic";
  }

  if (contentWidth) {
    classes += " w-content";
  } else {
    classes += " full-width";
  }
  
  return (
    <div className={`${classes} p-sm no-wrap  jcc mobile-column`}>
      <label htmlFor={id || label}>{label}:</label>
      <select
        name={id || label}
        id={id || label}
        value={value}
        onChange={onChange}
        className="full-width"
        disabled={disabled}
        required={required}
      >
        <option value={""} key={placeholder} disabled={disablePlaceholder}>
          {placeholder}
        </option>
        {listofOptions.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
