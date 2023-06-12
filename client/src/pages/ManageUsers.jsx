import React, { useEffect, useState } from "react";
import { fetchUsers } from "../api/users";
import { roles } from "../constants/user";
import api from "../api/index";
import { setMessage } from "../redux/actions/messageActions";
import { useDispatch } from "react-redux";
import useAuthContext from "../hooks/useAuthContext";

const ManageUsers = () => {
  const [role, setRole] = useState("Developer");
  const [filtered, setFiltered] = useState([]);
  const [indexesToUpdate, setIndexesToUpdate] = useState({});
  const [count, setCount] = useState(0);
  const { user } = useAuthContext();
  
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async (user) => {
      const response = await fetchUsers(user);
      const users = response.filter(
        (user) => user.role !== "Deleted" && user.role !== "Admin"
      );
      setFiltered(users);
    };
    fetchData(user);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const indexes = Object.keys(indexesToUpdate);
    const ids = indexes.map((index) => filtered[index]._id);

    await api.users.updateRoles(user, role, ids);
    const copy = [...filtered];
    for (let i = 0; i < indexes.length; i++) {
      let index = parseInt(indexes[i]);
      copy[index].role = role;
    }
    dispatch(setMessage(`Users were successfully updated`));
    clearCheckBoxes();
    setIndexesToUpdate({});
    setFiltered(copy);
    setCount(0);
  };

  const clearCheckBoxes = () => {
    const checkboxes = document.getElementsByClassName("checkbox");
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
  };

  const handleRowClick = (user, index) => {
    const copiedIndexes = { ...indexesToUpdate };
    const found = copiedIndexes[index];
    if (found) {
      delete copiedIndexes[index];
      setCount(count - 1);
    } else {
      copiedIndexes[index] = true;
      setCount(count + 1);
    }
    setIndexesToUpdate(copiedIndexes);
  };

  return (
    <>
      <div className="page flex-column gap-md">
        <h1 className="header">Manage Users</h1>
        <div className="flex aic space-between mobile-column jcc">
          {/* <span className="flex gap-md search mobile-column">
            <input type="text" placeholder="Search for member" />
            <button className="button-secondary" type="button">
              Clear
            </button>
          </span> */}
          <span className="flex gap-md aic mobile-column">
            <label htmlFor="Role" className="">
              New role to be assigned to selected users:
            </label>
            <select
              name="Role"
              onChange={(e) => setRole(e.currentTarget.value)}
              value={role}
              className="primary-border"
            >
              {roles.map((role) => (
                <option value={role} key={role}>
                  {role}
                </option>
              ))}
              {/* <option value={"Deleted"}>Deleted</option> */}
            </select>
          </span>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={count === 0}
            className="button-primary"
          >
            Update Users
          </button>
        </div>

        <div className="overflow-x only-full-width">
          {filtered.length > 0 ? (
            <>
              <table className="full-width">
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Project</th>
                    <th className="text-align">Bug Count</th>
                  </tr>
                </thead>
                <tbody>
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
                        <td>{user.project?.title || ""}</td>
                        <td className="text-align">{user.assignedBugs.length || 0}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          ) : (
            <>
              <div>No Users</div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ManageUsers;
