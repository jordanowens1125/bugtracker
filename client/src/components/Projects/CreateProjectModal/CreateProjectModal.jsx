import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import api from "../../../api/index";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import { setProjects } from "../../../redux/actions/projectActions";
import { setMessage } from "../../../redux/actions/messageActions";

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

const CreateProjectModal = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const currentUser = useSelector((state) => state.currentUser);
  const checkIfUserIsAnAdmin = (user) => {
    if (user.role === "Admin") {
      return true;
    }
    return false;
  };

  const userIsAnAdmin = true; //checkIfUserIsAnAdmin(currentUser);
  const handleModalOpen = () => setModalOpen(true);
  const theme = useTheme();
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
      console.log(newProjects);
      dispatch(setProjects(newProjects));
      dispatch(
        setMessage(
          `Project ${newInputValue.title} has been successfully created`
        )
      );
      setModalOpen(false);
      setFormInputData(initialState);
    } else {
    }
  };
  const handleModalClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setModalOpen(false);
  };
  return (
    <>
      {userIsAnAdmin ? (
        <>
          <div>
            <button
              onClick={handleModalOpen}
              aria-label="Open create project form"
              className="button-primary"
            >
              Create Project
            </button>
            <a
              href="/createproject"
              aria-label="Open create project form"
            >
              {" "}
              Create Project
            </a>

            <Modal
              open={modalOpen}
              onClose={handleModalClose}
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <form className="modal-content" onSubmit={handleFormSubmit}>
                <span>
                  <button
                    className="button-secondary"
                    onClick={handleModalClose}
                    type="button"
                  >
                    Cancel
                  </button>
                </span>
                <label htmlFor="title">Title:</label>
                <input
                  type="text"
                  required
                  id="title"
                  value={formInputData.title}
                  onChange={handleInputChange}
                  placeholder={`Character limit is ${MAX_TITLE_LENGTH}`}
                />
                <label htmlFor="description">Description:</label>
                <textarea
                  required
                  id="description"
                  className="h-md"
                  rows="4"
                  cols="50"
                  value={formInputData.description}
                  onChange={handleInputChange}
                  placeholder={`Character limit is ${MAX_DESCRIPTION_LENGTH}`}
                />
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
                <fieldset className="h-md flex-column">
                  {unAssignedUsers.map((user) => (
                    <div key={user._id} className="gap-md flex ">
                      <input type="radio" name={user.name} value={user}></input>
                      {user.name}
                      {user.email}
                    </div>
                  ))}
                </fieldset>
                <label htmlFor="startDate">Start:</label>
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  value={formInputData.startDate}
                  onChange={handleInputChange}
                />

                <label htmlFor="deadline">Deadline:</label>
                <input
                  type="date"
                  name="deadline"
                  id="deadline"
                  value={formInputData.deadline}
                  onChange={handleInputChange}
                />
                <div className="flex-column gap-lg aic">
                  <p>Public/Private</p>
                  <div className="flex gap-lg">
                    <span className="flex gap-lg">
                      <input
                        type="radio"
                        id="Public"
                        value={formInputData.public}
                        onClick={handleInputChange}
                        name="Public"
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
                        name="Public"
                      ></input>
                      <label htmlFor="Public">Private</label>
                    </span>
                  </div>
                </div>
                <button className="button-primary" type="submit">
                  Submit
                </button>
              </form>
            </Modal>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default CreateProjectModal;
