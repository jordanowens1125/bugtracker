import React, { useEffect, useState } from "react";
import api from "../api/index";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { setProjects } from "../redux/actions/projectActions";
import { setMessage } from "../redux/actions/messageActions";

const MAX_TITLE_LENGTH = 20;
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
  const dispatch = useDispatch();
  const users = useSelector((state) => state.allUsers.users);
  const projects = useSelector((state) => state.allProjects.projects);
  const unAssignedUsers = users.filter(
    (user) =>
      user.assignable === true &&
      user.deleted === false &&
      user.role === "Developer"
  );
  const [formInputData, setFormInputData] = useState(initialState);
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  useEffect(() => {}, [formInputData]);

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

  function replaceEmailsWithIDs(emails, users) {
    let userIds = [];
    if (emails.length > 0) {
      for (let i = 0; i < users.length; i++) {
        if (emails.includes(users[i].email)) {
          userIds.push(users[i]._id);
        }
      }
    }
    return userIds;
  }

  const handleRowClick = (user, index) => {
    const copiedIndexes = [...selectedIndexes];
    //keep track of indexes
    const found = copiedIndexes.includes(index);
    if (found) {
      const foundIndex = copiedIndexes.indexOf(index);
      copiedIndexes.splice(foundIndex, 1);
    } else {
      copiedIndexes.push(index);
    }
    console.log(copiedIndexes);
    setSelectedIndexes(copiedIndexes);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    //change list of members to ids here
    const memberIds = replaceEmailsWithIDs(
      formInputData.members,
      unAssignedUsers
    );
    const validated = true;
    if (validated) {
      const newInputValue = { ...formInputData };
      newInputValue["members"] = memberIds;
      const newProject = await api.projects.createProject(newInputValue);
      const newProjects = [...projects, newProject];
      dispatch(setProjects(newProjects));
      dispatch(
        setMessage(
          `Project ${newInputValue.title} has been successfully created`
        )
      );
      setFormInputData(initialState);
    } else {
    }
  };

  return (
    <div>
      <a href="/projects">See all projects</a>
      {userIsAnAdmin ? (
        <>
          <h1>Create Project</h1>
          <form className="modal-content" onSubmit={handleFormSubmit}>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              required
              id="title"
              value={formInputData.title}
              onChange={handleInputChange}
              placeholder={`Character limit is ${MAX_TITLE_LENGTH}`}
            />
            <div className="flex gap-lg">
              <div className="flex-column">
                <label htmlFor="description">Description:</label>
                <textarea
                  required
                  id="description"
                  rows="10"
                  cols="30"
                  value={formInputData.description}
                  onChange={handleInputChange}
                  placeholder={`Character limit is ${MAX_DESCRIPTION_LENGTH}`}
                />
              </div>
              <div>
                <span className="flex gap-lg">
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
              </div>
              <div>
                <label htmlFor="Public">Public/Private:</label>
                <span className="flex gap-lg">
                  <input
                    type="radio"
                    id="Public"
                    value={formInputData.public}
                    onClick={handleInputChange}
                    name="public"
                    defaultChecked
                  ></input>
                  <label htmlFor="Public">Public</label>
                </span>
                <span className="flex gap-lg">
                  <input
                    type="radio"
                    id="Public"
                    value={false}
                    onClick={handleInputChange}
                    name="public"
                  ></input>
                  <label htmlFor="Public">Private</label>
                </span>
              </div>
            </div>

            {/* <FormControl>
                  <InputLabel id="demo-multiple-chip-label">Members</InputLabel>
                  <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    name={"members"}
                    multiple
                    value={formInputData.members || []} //set to current personName list
                    onChange={handleInputChange}
                    input={
                      <OutlinedInput id="select-multiple-chip" label="Chip" />
                    }
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {unAssignedUsers.map((user) => (
                      <MenuItem
                        key={user._id}
                        value={user.email}
                        style={getStyles(user, user.email, theme)}
                      >
                        {user.email}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}
            <label htmlFor="members">Project Members:</label>
            <div className="h-md overflow-y">
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
                  {unAssignedUsers.length > 0 ? (
                    <>
                      {unAssignedUsers.map((user, index) => {
                        return (
                          <tr key={user._id}>
                            <td>
                              <input
                                type="checkbox"
                                onClick={() => handleRowClick(user, index)}
                                value={false}
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

            <button className="button-primary" type="submit">
              Submit
            </button>
          </form>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CreateProject;
