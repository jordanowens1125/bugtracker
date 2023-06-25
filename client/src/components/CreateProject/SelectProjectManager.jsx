import SelectByField from "../Shared/SelectByField";
const SelectProjectManager = ({
  list,
  label,
  onChange,
  displayfield,
  id,
  field,
  required = true,
}) => {
  return (
    <SelectByField
      listofOptions={list}
      label={label}
      onChange={onChange}
      displayfield={displayfield}
      id={id}
      field={field}
      required={required}
    />
  );
};

export default SelectProjectManager;
