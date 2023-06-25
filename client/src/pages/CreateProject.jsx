import React, { useEffect, useState } from "react";
import api from "../api/index";
import dayjs from "dayjs";
import useAuthContext from "../hooks/useAuthContext";
import useMessageContext from "../hooks/messageContext";
import Input from "../components/Shared/GeneralInput";
import NoData from "../components/Shared/NoData";
import Table from "../components/Shared/Table";
import SelectByField from "../components/Shared/SelectByField";

const MAX_TITLE_LENGTH = 30;
const MAX_DESCRIPTION_LENGTH = 200;

const initialState = {
  title: "",
  description: "",
  deadline: dayjs(new Date()).format("YYYY-MM-DD"),
  history: [],
  members: [],
  bugs: [],
  projectManager: {},
  client: "",
  public: true,
};

const TableContent = ({ members, removeUser, addUser }) => {
  return (
    <>
      {members.map((user, index) => {
        return (
          <tr key={user._id}>
            {removeUser && (
              <td>
                <button
                  className="button-secondary"
                  type="button"
                  onClick={() => removeUser(user, index)}
                >
                  Remove
                </button>
              </td>
            )}
            {addUser && (
              <>
                <td>
                  <button
                    className="button-secondary"
                    onClick={() => {
                      addUser(user, index);
                    }}
                    type="button"
                  >
                    Add
                  </button>
                </td>
              </>
            )}
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
          </tr>
        );
      })}
    </>
  );
};

const CreateProject = () => {
  const [available, setAvailable] = useState([]);
  const [savedAvailable, setSavedAvailable] = useState([]);
  const messageInfo = useMessageContext();
  const [formInputData, setFormInputData] = useState(initialState);
  const { user } = useAuthContext();
  useEffect(() => {
    const fetchData = async (user) => {
      const users = await api.users.fetchUsers(user);
      const filtered = users.filter(
        (user) =>
          (user.role !== "Deleted" &&
            user.role !== "Admin" &&
            user.project === undefined) ||
          null
      );
      setAvailable(filtered);
      setSavedAvailable(filtered);
    };
    fetchData(user);
  }, [user]);

  const reset = () => {
    setFormInputData(initialState);
    setAvailable(savedAvailable);
  };

  const handleInputChange = (e) => {
    const inputFieldValue = e.target.value;
    const inputFieldName = e.target.name || e.target.id;
    if (inputFieldName === "title" && inputFieldValue.length > MAX_TITLE_LENGTH)
      return;
    if (
      inputFieldName === "description" &&
      inputFieldValue.length > MAX_DESCRIPTION_LENGTH
    )
      return;
    const NewInputValue = {
      ...formInputData,
      [inputFieldName]: inputFieldValue,
    };
    setFormInputData(NewInputValue);
  };

  // const handleDeveloperSelect = (e) => {
  //   e.preventDefault();
  //   console.log(e.target.value);
  // };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    //change list of members to ids here
    const memberIds = formInputData.members.map((member) => member._id);
    const validated = true;
    if (validated) {
      const newInputValue = { ...formInputData };
      newInputValue["members"] = memberIds;
      await api.projects.createProject(user, newInputValue);
      messageInfo.dispatch({
        type: "SHOW",
        payload: `Project ${newInputValue.title} has been successfully created!`,
      });
      setSavedAvailable(available);
      setFormInputData(initialState);
    } else {
    }
  };

  const addUser = (user, index) => {
    const copy = structuredClone(formInputData);
    const copyAvailable = [...available];
    copyAvailable.splice(index, 1);
    copy.members.push(user);
    setFormInputData(copy);
    setAvailable(copyAvailable);
  };

  const removeUser = (user, index) => {
    const copy = { ...formInputData };
    const copyAvailable = [...available];
    copy.members.splice(index, 1);
    copyAvailable.push(user);
    setFormInputData(formInputData);
    setAvailable(copyAvailable);
  };

  return (
    <form
      className="create-project page flex-column"
      onSubmit={handleFormSubmit}
    >
      <span className="header">
        <a href="/projects">See All Projects</a>
        <h1>Create Project</h1>
      </span>
      <span className="title flex-column full-width">
        <Input
          value={formInputData.title}
          onChange={handleInputChange}
          placeholder={`Character limit is ${MAX_TITLE_LENGTH}...`}
          label={"Title"}
          id={"title"}
        />
      </span>
      <div className="flex-column full-width">
        <label htmlFor="description">Description:</label>
        <textarea
          required
          id="description"
          rows="10"
          value={formInputData.description}
          onChange={handleInputChange}
          placeholder={`Character limit is ${MAX_DESCRIPTION_LENGTH}...`}
        />
      </div>
      <span className="flex-column full-width">
        <span className="flex-column">
          <Input
            type="date"
            name="deadline"
            id="deadline"
            label={"Deadline Date"}
            value={formInputData.deadline}
            onChange={handleInputChange}
          />
        </span>
      </span>
      {/* <SelectByField label={"Developers"} value={}/> */}
      {/* <label htmlFor={"label"}>{"Developers"}:</label>
      <select multiple onChange={handleDeveloperSelect} name="Members">
        {available.map((member) => (
          <option key={member._id} value={member._id}>
            {member.name}
          </option>
        ))}
      </select> */}
      <div className="h-lg only-full-width">
        {available.length > 0 ? (
          <Table
            caption={"Available"}
            headings={["", "Name", "Email", "Role"]}
            content={<TableContent members={available} addUser={addUser} />}
          />
        ) : (
          <NoData title={"Users"} caption={"Available Members"} />
        )}
      </div>
      <div className="h-lg only-full-width">
        {formInputData.members.length > 0 ? (
          <Table
            headings={["Name", "Email", "Role"]}
            caption={"Selected"}
            content={
              <TableContent
                members={formInputData.members}
                removeUser={removeUser}
              />
            }
          />
        ) : (
          <NoData title="Users" caption={"Selected"} />
        )}
      </div>
      <span className="flex">
        <button className="button-secondary" onClick={reset} type="button">
          Reset
        </button>
        <button className="button-primary" type="submit">
          Submit
        </button>
      </span>
    </form>
  );
};

export default CreateProject;
