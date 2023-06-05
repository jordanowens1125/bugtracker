import React from "react";

const SelectedUsers = (indexes, users) => {
  return (
    <table className="full-width">
      <caption>Selected Users</caption>
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        {indexes.length > 0 ? (
          <>
            {indexes.map((index) => {
              const user = users[index];
              return (
                <tr key={index}>
                  <td>
                    {/* <button
                                className="button-secondary"
                                onClick={() => handleRowClick(user, index)}
                              >
                                Del
                              </button> */}
                  </td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              );
            })}
          </>
        ) : (
          <>
            <tr>
              <td>No Users</td>
            </tr>
          </>
        )}
      </tbody>
    </table>
  );
};

export default SelectedUsers;
