const MultiSelect = ({
  label,
  onChange,
  listOfOptions,
  id,
  field,
  displayfield,
}) => {
  return (
    <>
      <label htmlFor={label}>{label}:</label>
      <select
        name={id}
        onChange={onChange}
        className="full-width"
        multiple
      >
        {listOfOptions.map((option) => (
          <option value={option[field]} key={option[field]}>
            {option[displayfield]}
          </option>
        ))}
      </select>
    </>
  );
};

export default MultiSelect;
