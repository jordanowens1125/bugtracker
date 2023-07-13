const SelectedDevelopers = ({
  developers,
  handleDeveloperSelect,
  selectedDevelopersObj,
  developerCount
}) => {
  return (
    <div className="flex mobile-column mobile-text-align full-width">
      <label htmlFor="Select">Developers: {developerCount}</label>
      <div className="h-sm primary-border overflow-y p-md b-radius full-width">
        {developers.map((user) => {
          const classObj = {
            false: "",
            true: "selected",
          };
          return (
            <div
              className={`option  ${classObj[selectedDevelopersObj[user._id]]}`}
              key={user._id}
              onClick={(e) => handleDeveloperSelect(e, user._id)}
            >
              {user.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectedDevelopers;
