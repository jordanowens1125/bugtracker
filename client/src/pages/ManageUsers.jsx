import React, { useEffect, useState } from "react";
import { fetchUsers } from "../api/users";
import { roles } from "../constants/user";
import api from "../api/index";

const ManageUsers = () => {
  const [role, setRole] = useState("Developer");
  const [filtered, setFiltered] = useState([]);
  const [indexesToUpdate, setIndexesToUpdate] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchUsers();
      // setUsers(response);
      setFiltered(
        response.filter(
          (user) => user.role !== "Deleted" && user.role !== "Admin"
        )
      );
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ids = [];
    const copy = [...filtered];
    for (let i = 0; i < indexesToUpdate.length; i++) {
      copy[indexesToUpdate[i]].role = role;
      ids.push(copy[indexesToUpdate[i]]._id);
    }
    await api.users.updateRoles(role, ids);
    const checkboxes = document.getElementsByClassName("checkbox");
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
    setIndexesToUpdate([]);
    setFiltered(copy);
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
    setIndexesToUpdate(copiedIndexes);
  };

  return (
    <>
      <div className="manage-users page">
        <h1 className="header">Manage Users</h1>

        <span className="flex gap-md search">
          <input type="text" placeholder="Search for member" />
          <button className="button-secondary" type="button">
            Clear
          </button>
        </span>
        <div className="available h-lg">
          <table className="full-width">
            <caption>All Users</caption>
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
                            className="checkbox"
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
                  <tr>
                    <td>No Users</td>
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
