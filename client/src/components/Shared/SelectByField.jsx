const SelectByField = ({
  label,
  value,
  onChange,
  listofOptions,
  id,
  field,
  displayfield,
}) => {
  return (
    <>
      <label htmlFor={label}>{label}:</label>
      <select
        name={id}
        value={value}
        onChange={onChange}
        className="full-width"
      >
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
