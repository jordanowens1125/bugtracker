import React, { useEffect, useState } from "react";
import { setMessage } from "../redux/actions/messageActions";
import { useDispatch } from "react-redux";
import useAuthContext from "../hooks/useAuthContext";
import api from "../api/index";
import { fetchUsers } from "../api/users";

const DeleteUsers = () => {
  const [filtered, setFiltered] = useState([]);
  const { user } = useAuthContext();
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();
  // const [selectedUsers, setSelectedUsers] = useState([]);
  // const [deleteMode, setDeleteode] = useState(false);
  const [keys, setKeys] = useState({});
  useEffect(() => {
    const fetchData = async (user) => {
      const response = await fetchUsers(user);
      // setUsers(response);
      setFiltered(
        response.filter(
          (user) => user.role !== "Deleted" && user.role !== "Admin"
        )
      );
    };
    fetchData(user);
  }, [user]);

  const handleRowClick = (user, index) => {
    let copy = { ...keys };
    if (!keys[index]) {
      //selectedUsers.push(user)
      copy[index] = user;
      setCount(count + 1);
    } else {
      delete copy[index];
      setCount(count - 1);
    }
    setKeys(copy);
  };

  const convertListToIDs = () => {
    let indexes = Object.keys(keys);
    let copy = [...filtered];
    //reverse indexes which are usually in ascending order
    indexes.sort(function (a, b) {
      return b - a;
    });
    for (let i = 0; i < indexes.length; i++) {
      copy.splice(indexes[i], 1);
    }
    return [indexes.map((index) => keys[index]._id), copy];
  };

  const DeleteSelected = async () => {
    let [ids, newUsers] = convertListToIDs();
    const response = await api.users.deleteUsers(user, ids);
    if (response.status === 200) {
      dispatch(setMessage(`${count} user/users successfully deleted.`));
      setCount(0);
      setFiltered(newUsers);
    } else {
    }
  };
  return (
    <main className="full-height">
      <span className="flex aic space-between">
        <h1>Delete Users</h1>
        <i>
          Selected Users :{" "}
          <b>
            <i className="primary">{count}</i>
          </b>
        </i>
        <button
          className="button-primary"
          onClick={DeleteSelected}
          disabled={count === 0}
        >
          Delete
        </button>
      </span>

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
            <>
              <tr>
                <td>No Users</td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </main>
  );
};

export default DeleteUsers;
