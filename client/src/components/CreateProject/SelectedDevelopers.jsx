const SelectedDevelopers = ({ developers, handleDeveloperSelect }) => {
  return (
    <div className="flex mobile-column mobile-text-align full-width">
        <label htmlFor="Select">Developers:</label>
        <div className="h-sm primary-border overflow-y p-md b-radius full-width">
          {developers
            .map((user) => {
              return (
                <div
                  className="option"
                  key={user._id}
                  onClick={(e) => handleDeveloperSelect(e, user._id)}
                >
                  {user.name}
                </div>
              );
            })}
        </div>
      </div>
  )
}

export default SelectedDevelopers