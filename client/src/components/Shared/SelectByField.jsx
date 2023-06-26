const SelectByField = ({
  label,
  value,
  onChange,
  listofOptions,
  id,
  field,
  displayfield,
  placeholder,
  required = true,
  disabled
}) => {
  return (
    <>
      <label htmlFor={id || label}>{label}:</label>
      <select
        name={id}
        id={id}
        value={value}
        onChange={onChange}
        className="full-width"
        required={required}
        disabled={disabled}
      >
        <option value={undefined}>{placeholder}</option>
        {listofOptions.map((option) => (
          <option value={option[field]} key={option[field]}>
            {option[displayfield]}
          </option>
        ))}
      </select>
    </>
  );
};

export default SelectByField;
