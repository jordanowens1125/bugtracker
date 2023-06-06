import React, { useEffect, useState } from "react";
import { fetchUsers } from "../api/users";
import { roles } from "../constants/user";
import api from "../api/index";
import { setMessage } from "../redux/actions/messageActions";
import { useDispatch } from "react-redux";
import useAuthContext from "../hooks/useAuthContext";
// import SelectedUsers from "../components/Shared/SelectedUsers";

const ManageUsers = () => {
  const [role, setRole] = useState("Developer");
  const [filtered, setFiltered] = useState([]);
  const [indexesToUpdate, setIndexesToUpdate] = useState([]);
  const { user } = useAuthContext();

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async (user) => {
      const response = await fetchUsers(user);
      setFiltered(
        response.filter(
          (user) => user.role !== "Deleted" && user.role !== "Admin"
        )
      );
    };
    fetchData(user);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ids = [];
    const copy = [...filtered];
    for (let i = 0; i < indexesToUpdate.length; i++) {
      copy[indexesToUpdate[i]].role = role;
      ids.push(copy[indexesToUpdate[i]]._id);
    }
    await api.users.updateRoles(user, role, ids);
    dispatch(setMessage(`Users were successfully updated`));
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
      <div className="page flex-column gap-md">
        <h1 className="header">Manage Users</h1>
        <div className="flex space-between full-width mobile-column max-w-lg">
          <span className="flex gap-md search space-between full-width">
            <input type="text" placeholder="Search for member" />
            <button className="button-secondary" type="button">
              Clear
            </button>
          </span>
          <div className="flex gap-md mobile-column space-between full-width">
            <span className="flex-column ">
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
                  {/* <option value={"Deleted"}>Deleted</option> */}
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
        <p className="caption">All Users</p>
        <div className="overflow-x only-full-width">
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
                <>
                  <tr>
                    <td>No Users</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
        {/* <div className="full-width selected h-lg">
          <SelectedUsers indexes={indexesToUpdate} users={filtered} />
        </div> */}
      </div>
    </>
  );
};

export default ManageUsers;
