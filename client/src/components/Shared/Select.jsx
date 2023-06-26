const Select = ({
  label,
  value,
  onChange,
  listofOptions,
  id,
  disabled,
  required = true,
}) => {
  return (
    <>
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
        {listofOptions.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    </>
  );
};

export default Select;
