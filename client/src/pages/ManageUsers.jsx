import React, { useEffect, useState } from "react";
import { fetchUsers } from "../api/users";
import api from "../api/index";
import useAuthContext from "../hooks/useAuthContext";
import useMessageContext from "../hooks/messageContext";
import CreateUserModal from "../components/ManageUsers.jsx/CreateUserModal";
import DeleteUsersModal from "../components/ManageUsers.jsx/DeleteUsersModal";
import ManageUsersPage from "../components/ManageUsers.jsx/Page";

const ManageUsers = () => {
  const [role, setRole] = useState("Developer");
  const [filtered, setFiltered] = useState([]);
  const [indexesToUpdate, setIndexesToUpdate] = useState({});
  const [count, setCount] = useState(0);
  const { user } = useAuthContext();
  const messageInfo = useMessageContext();
  const [createMode, setCreateMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  useEffect(() => {
    const fetchData = async (user) => {
      try {
        const response = await fetchUsers(user);
        const users = response.filter(
          (user) => user.role !== "Deleted" && user.role !== "Admin"
        );
        setFiltered(users);
      } catch (error) {}
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
    messageInfo.dispatch({
      type: "SHOW",
      payload: `User(s) were successfully updated`,
    });

    clearCheckBoxes();
    setIndexesToUpdate({});
    setFiltered(copy);
    setCount(0);
  };

  const handleDelete = async () => {
    setDeleteMode(false);
    clearCheckBoxes();
    messageInfo.dispatch({
      type: "SHOW",
      payload: `User(s) were successfully deleted`,
    });
    setIndexesToUpdate({});
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
      {createMode && (
        <CreateUserModal
          cancel={() => setCreateMode(false)}
          users={filtered}
          setUsers={setFiltered}
        />
      )}
      {deleteMode && (
        <DeleteUsersModal
          cancel={() => setDeleteMode(false)}
          users={filtered}
          indexes={indexesToUpdate}
          handleDelete={handleDelete}
          setUsers={setFiltered}
        />
      )}
      <ManageUsersPage
        setRole={setRole}
        role={role}
        handleRowClick={handleRowClick}
        count={count}
        setCreateMode={setCreateMode}
        setDeleteMode={setDeleteMode}
        filtered={filtered}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default ManageUsers;
