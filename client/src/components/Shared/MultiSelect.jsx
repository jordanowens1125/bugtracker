const MultiSelect = ({
  label,
  onChange,
  listOfOptions,
  id,
  field,
  displayfield,
  selected,
}) => {
  const classObject = (bool) => {
    const classList = {
      true: `option option-modal selected`,
      false: `option option-modal`,
    };
    return classList[bool];
  };
  return (
    <div className="flex mobile-column mobile-text-align full-width">
      <label htmlFor={label}>{label}:</label>
      <div className="h-sm select-modal overflow-y p-md b-radius full-width">
        {listOfOptions.map((option) => {
          return (
            <div
              className={classObject(Object.hasOwn(selected, option[field]))}
              key={option[field]}
              onClick={(e) => onChange(e, option)}
              id={id || label}
            >
              {option[displayfield]}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MultiSelect;
