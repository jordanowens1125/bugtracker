import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import api from "../../../api/index";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
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

const style = {
  margin: "auto",
  width: "60%",
  height: "90%",
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  overflowY: "auto",
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, bugName, theme) {
  return {
    fontWeight:
      bugName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

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
              <Box sx={style}>
                <button className="button-secondary" onClick={handleModalClose}>
                  Cancel
                </button>
                <TextField
                  required
                  label="Title"
                  title={formInputData.title}
                  onChange={handleInputChange}
                  id="title"
                  value={formInputData.title}
                  placeholder={`Character limit is ${MAX_TITLE_LENGTH}`}
                />
                <TextField
                  required
                  id="description"
                  label="Description"
                  description={formInputData.description}
                  minRows={8}
                  onChange={handleInputChange}
                  multiline
                  value={formInputData.description}
                  placeholder={`Character limit is ${MAX_DESCRIPTION_LENGTH}`}
                />
                <FormControl>
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
                </FormControl>
                <TextField
                  id="start"
                  label="Start"
                  name="start"
                  type="date"
                  defaultValue={formInputData.startDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleInputChange}
                />
                <TextField
                  id="deadline"
                  label="Deadline"
                  name="deadline"
                  type="date"
                  defaultValue={formInputData.deadline}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleInputChange}
                />
                <div className="flex-column gap-lg aic">
                  <p>Public/Private</p>
                  <div className="flex gap-lg">
                    <span className="flex gap-lg">
                      <input
                        type="radio"
                        id="Public"
                        value={true}
                        onClick={handleInputChange}
                        name="Public"
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
                <button
                  className="button-primary"
                  onClick={(e) => {
                    handleFormSubmit(e);
                  }}
                >
                  Submit
                </button>
              </Box>
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
