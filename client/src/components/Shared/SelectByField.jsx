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
    <div className="flex-column full-width p-sm">
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
        <option value={''} disabled='disabled'>{placeholder}</option>
        {listofOptions.map((option) => (
          <option value={option[field]} key={option[field]}>
            {option[displayfield]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectByField;
