const Select = ({ label, value, onChange, listofOptions, id }) => {
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
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    </>
  );
};

export default Select;
