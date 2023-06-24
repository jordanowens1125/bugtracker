import Table from "../Shared/Table";
import useAuthContext from "../../hooks/useAuthContext";
import api from "../../api";

const UserList = ({ users, indexList }) => {
  return (
    <>
      {indexList.map((index) => (
        <tr key={users[index]._id}>
          <td>{users[index].name}</td>
          <td>{users[index].email}</td>
          <td>{users[index].role}</td>
        </tr>
      ))}
    </>
  );
};

const DeleteUsersModal = ({
  users,
  cancel,
  indexes,
  setUsers,
  handleDelete,
}) => {
  const { user } = useAuthContext();
  const indexList = Object.keys(indexes);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const ids = indexList.map((index) => users[index]._id);
    const response = await api.users.deleteUsers(user, ids);
    if (response.status === 200) {
      handleDelete();
      removeDeletedUsers();
    } else {
    }
  };

  const removeDeletedUsers = () => {
    let copy = [...users];
    let sortedIndexArr = indexList.sort(function (a, b) {
      return b - a;
    });
    for (let i = 0; i < sortedIndexArr.length; i++) {
      copy.splice(sortedIndexArr[i], 1);
    }
    setUsers(copy);
  };
  return (
    <div className="modal">
      <form className="modal-content" onSubmit={handleSubmit}>
        <h2>Delete Users</h2>
        <div className="h-md">
          <Table
            headings={["Name", "Email", "Role"]}
            content={<UserList users={users} indexList={indexList} />}
          />
        </div>
        <p className="error">
          Are you sure you want to delete the listed users? This action cannot
          be undone.
        </p>
        <span className="flex">
          <button onClick={cancel} className="button-secondary" type="button">
            Cancel
          </button>
          <button className="button-urgent" type="submit">
            Delete Listed Users
          </button>
        </span>
      </form>
    </div>
  );
};

export default DeleteUsersModal;
