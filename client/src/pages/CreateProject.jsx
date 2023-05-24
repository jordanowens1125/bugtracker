import React, { useEffect, useState } from "react";
import api from "../api/index";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { setMessage } from "../redux/actions/messageActions";

const MAX_TITLE_LENGTH = 30;
const MAX_DESCRIPTION_LENGTH = 200;

const initialState = {
  title: "",
  description: "",
  status: "On Track",
  startDate: dayjs(new Date()).format("YYYY-MM-DD"),
  deadline: dayjs(new Date()).format("YYYY-MM-DD"),
  history: [],
  members: [],
  bugs: [],
  client: "",
  public: true,
};

const CreateProject = () => {
  const userIsAnAdmin = true; //checkIfUserIsAnAdmin(currentUser);
  const [available, setAvailable] = useState([]);
  const [savedAvailable, setSavedAvailable] = useState([]);
  const dispatch = useDispatch();
  const [formInputData, setFormInputData] = useState(initialState);
  useEffect(() => {
    const fetchData = async () => {
      const users = await api.users.fetchUsers();
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
    fetchData();
  }, []);

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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    //change list of members to ids here
    const memberIds = formInputData.members.map((member) => member._id);
    const validated = true;
    if (validated) {
      const newInputValue = { ...formInputData };
      newInputValue["members"] = memberIds;
      await api.projects.createProject(newInputValue);
      dispatch(
        setMessage(
          `Project ${newInputValue.title} has been successfully created`
        )
      );
      setSavedAvailable(available);
      setFormInputData(initialState);
    } else {
    }
  };

  const addUser = (user, index) => {
    console.log(index);
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
    <form className="create-project page" onSubmit={handleFormSubmit}>
      <span className="header">
        <a href="/projects">See all projects</a>
        <h1>Create Project</h1>
      </span>
      <span className="title flex-column">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          required
          id="title"
          value={formInputData.title}
          onChange={handleInputChange}
          placeholder={`Character limit is ${MAX_TITLE_LENGTH}...`}
        />
      </span>
      <div className="flex-column description full-height">
        <label htmlFor="description">Description:</label>
        <textarea
          required
          id="description"
          cols="30"
          rows="10"
          className="full-height"
          value={formInputData.description}
          onChange={handleInputChange}
          placeholder={`Character limit is ${MAX_DESCRIPTION_LENGTH}...`}
        />
      </div>
      <span className="info flex-column gap-md">
        <span className="flex-column gap-lg">
          <span className="flex-column">
            <label htmlFor="startDate">Start:</label>
            <input
              type="date"
              name="startDate"
              id="startDate"
              value={formInputData.startDate}
              onChange={handleInputChange}
            />
          </span>
          <span className="flex-column">
            <label htmlFor="deadline">Deadline:</label>
            <input
              type="date"
              name="deadline"
              id="deadline"
              value={formInputData.deadline}
              onChange={handleInputChange}
            />
          </span>
        </span>
        <span className="flex-column">
          <label htmlFor="">Public/Private</label>
          <select
            name="public"
            value={formInputData.public}
            onChange={handleInputChange}
          >
            <option value={true}>Public</option>
            <option value={false}>Private</option>
          </select>
        </span>
      </span>

      <div className="h-lg  available">
        <table className="full-width">
          <caption>Available</caption>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {available.length > 0 ? (
              <>
                {available.map((user, index) => {
                  return (
                    <tr key={user._id}>
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
      <div className="h-lg  selected">
        <table className="full-width">
          <caption>Selected</caption>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {formInputData.members.length > 0 ? (
              <>
                {formInputData.members.map((user, index) => {
                  return (
                    <tr key={user._id}>
                      <td>
                        <button
                          className="button-secondary"
                          type="button"
                          onClick={() => removeUser(user, index)}
                        >
                          Remove
                        </button>
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
      <span className="submit flex space-between flex-end">
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
