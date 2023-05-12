import React, { useEffect, useState } from "react";
import { fetchUsers } from "../api/users";

const roles = ["Admin", "Developer", "Project Manager", "Viewer"];

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("Developer");
  const filtered = users.filter(
    (user) => user.role !== "Deleted" && user.role !== "Admin"
  );
  const [usersToUpdate, setUsersToUpdate] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchUsers();
      setUsers(response);
    };
    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleRowClick = (e) => {
    console.log(e.currentTarget.value);
  };

  return (
    <>
      <h1>Manage Users</h1>
      <div className="flex-column full-vh ">
        <div className="flex full-width p-lg flex-start gap-xl space-between">
          <form onSubmit={handleSubmit}>
            <span className="flex-column gap-lg">
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
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {usersToUpdate.length > 0 ? (
                  <>
                    {usersToUpdate.map((user, index) => {
                      return (
                        <tr key={user._id}>
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
            <button type="submit" className="button-primary">
              Update Users
            </button>
          </form>{" "}
          <div className="flex-column gap-md aic">
            <span className="flex gap-md">
              <input type="text" placeholder="Search for member" />
              <button className="button-secondary">Clear</button>
            </span>
            <table>
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
                              onClick={handleRowClick}
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
        </div>
      </div>
    </>
  );
};

export default ManageUsers;
