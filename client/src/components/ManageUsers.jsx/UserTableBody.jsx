const UserTableBody = (users, handleRowClick) => {
  return (
    <>
      {users.map((user, index) => {
        return (
          <tr key={user._id} onMouseOver={() => console.log(123)}>
            <td>
              <input
                type="checkbox"
                className="checkbox"
                onClick={() => handleRowClick(user, index)}
                disabled={user.demo}
              ></input>
            </td>
            <td>
              {user.name}{" "}
            </td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
              <a href={`/profile/${user._id}`}>Details</a>
            </td>
          </tr>
        );
      })}
    </>
  );
};

export default UserTableBody;
