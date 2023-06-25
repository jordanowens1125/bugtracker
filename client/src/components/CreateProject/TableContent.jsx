const TableContent = ({ members, removeUser, addUser }) => {
  return (
    <>
      {members.map((user, index) => {
        return (
          <tr key={user._id}>
            {removeUser && (
              <td>
                <button
                  className="button-secondary"
                  type="button"
                  onClick={() => removeUser(user, index)}
                >
                  Remove
                </button>
              </td>
            )}
            {addUser && (
              <>
                <td>
                  <button
                    className="button-secondary"
                    onClick={() => {
                      addUser(user, index);
                    }}
                    type="button"
                  >
                    Add
                  </button>
                </td>
              </>
            )}
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
          </tr>
        );
      })}
    </>
  );
};

export default TableContent;
