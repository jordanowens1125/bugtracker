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
import { setUsers } from "../../../redux/actions/userActions";
import { setMessage } from "../../../redux/actions/messageActions";

const MAX_TITLE_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 200;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: "25px",
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

  const userIsAnAdmin = checkIfUserIsAnAdmin(currentUser);
  const handleModalOpen = () => setModalOpen(true);
  const theme = useTheme();
  const dispatch = useDispatch();
  const unAssignedUsers = useSelector(
    (state) => state.allUsers.unAssignedUsers
  );

  const [formInputData, setFormInputData] = useState({
    title: "",
    description: "",
    status: "On Track",
    startDate: dayjs(new Date()).format("YYYY-MM-DD"),
    deadline: dayjs(new Date()).format("YYYY-MM-DD"),
    history: [],
    members: [],
    bugs: [],
    client: "",
    public: false,
  });
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
    const validated = true
    if (validated) {
      const newInputValue = { ...formInputData };
      newInputValue["members"] = memberIds;
      await api.projects.createProject(newInputValue);
      const newProjects = await api.projects.fetchProjects();
      dispatch(setProjects(newProjects));
      const newUsers = await api.users.fetchUsers();
      dispatch(setUsers(newUsers));
      dispatch(
        setMessage(`Project ${newInputValue.title} has been successfully created`)
      );
      setModalOpen(false);
      setFormInputData({
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
      });
    }
    else {
      
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
            <Button
              variant="contained"
              onClick={handleModalOpen}
              aria-label="Open create project form"
            >
              Create Project
            </Button>
            <Modal
              open={modalOpen}
              onClose={handleModalClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
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
                <FormControl>
                  <FormLabel id="demo-controlled-radio-buttons-group">
                    Public/Private
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="public"
                    id="public"
                    value={formInputData.public}
                    onChange={handleInputChange}
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      label="Public"
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label="Private"
                    />
                  </RadioGroup>
                </FormControl>
                <Button
                  aria-label="Submit create project form"
                  variant="contained"
                  onClick={(e) => {
                    handleFormSubmit(e);
                  }}
                >
                  Submit
                </Button>
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
