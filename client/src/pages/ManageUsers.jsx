import React, { useEffect, useState } from "react";
import { fetchUsers } from "../api/users";

const roles = ["Admin", "Developer", "Project Manager", "Viewer"];

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("Developer");
  const filtered = users.filter(
    (user) => user.role !== "Deleted" && user.role !== "Admin"
  );
  const [indexesToUpdate, setIndexesToUpdate] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchUsers();
      setUsers(response);
    };
    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIndexesToUpdate([]);
  };

  const handleRowClick = (user, index) => {
    const copiedIndexes = [...indexesToUpdate];
    const found = copiedIndexes.includes(index);
    if (found) {
      const foundIndex = copiedIndexes.indexOf(index);
      copiedIndexes.splice(foundIndex, 1);
    } else {
      copiedIndexes.push(index);
    }
    console.log(copiedIndexes);
    setIndexesToUpdate(copiedIndexes);
  };

  return (
    <>
      <div className="manage-users page">
        <h1>Manage Users</h1>
        <span className="flex gap-md search">
          <input type="text" placeholder="Search for member" />
          <button className="button-secondary" type="button">
            Clear
          </button>
        </span>
        <div className="available">
          <table className="full-width">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                <>
                  {filtered.map((user, index) => {
                    return (
                      <tr key={user._id}>
                        <td>
                          <input
                            type="checkbox"
                            onClick={() => handleRowClick(user, index)}
                          ></input>
                        </td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                      </tr>
                    );
                  })}
                </>
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </div>

        <div className="full-width selected h-lg">
          <table className="full-width">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {indexesToUpdate.length > 0 ? (
                <>
                  {indexesToUpdate.map((index) => {
                    const user = filtered[index];
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
                  <tr className="flex aic">
                    <td>No users</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        <div className="submit flex space-between mobile-column full-width">
          <span className="flex-column gap-md mobile-column">
            <label htmlFor="">Role to be assigned to users:</label>
            <span>
              <select
                name=""
                id=""
                onChange={(e) => setRole(e.currentTarget.value)}
                value={role}
              >
                {roles.map((role) => (
                  <option value={role} key={role}>
                    {role}
                  </option>
                ))}
              </select>
            </span>
          </span>
          <button
            type="button"
            onClick={handleSubmit}
            className="button-primary"
          >
            Update Users
          </button>
        </div>
      </div>
    </>
  );
};

export default ManageUsers;
