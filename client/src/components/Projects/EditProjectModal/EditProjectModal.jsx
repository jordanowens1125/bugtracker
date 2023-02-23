import React, { useState, useMemo } from "react";
import api from "../../../api/index";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import {
  setProjects,
  selectedProject,
} from "../../../redux/actions/projectActions";
import { setMessage } from "../../../redux/actions/messageActions";
import { setUsers } from "../../../redux/actions/userActions";
import Avatar from "@mui/material/Avatar";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";

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

const EditProjectModal = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const user = useSelector((state) => state.currentUser);
  const isAdminUser = user.role === "Admin";
  const handleModalOpen = () => setModalOpen(true);
  const currentProject = useSelector((state) => state.project);
  const availableMembers = useSelector((state) => state.availableMembers);
  const dispatch = useDispatch();
  const [formInputData, setFormInputData] = useState({
    title: "",
    description: "",
    status: "On Track",
    startDate: dayjs(new Date()).format("YYYY-MM-DD"),
    deadline: dayjs(new Date()).format("YYYY-MM-DD"),
    history: [],
    members: [],
    bugs: [],
    completionDate: "",
    client: "",
    public: true,
  });

  useMemo(() => {
    if (currentProject.members) {
      const newInputValue = { ...currentProject };
      newInputValue.members = currentProject?.members.map((i) => i._id);
      setFormInputData(newInputValue);
    }
  }, [currentProject]);

  const handleInputChange = (e) => {
    const inputFieldValue = e.target.value;
    const inputFieldName = e.target.id || e.target.name; //target name for the bugs select
    let newInputValue = { ...formInputData };
    newInputValue[inputFieldName] = inputFieldValue;
    setFormInputData(newInputValue);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    //current Project needs both the members and bugs to be populated from backend to display on page
    const updatedProject = await api.projects.updateProject(
      currentProject._id,
      formInputData
    );
    dispatch(selectedProject(updatedProject));
    const newProjects = await api.projects.fetchProjects();
    dispatch(setProjects(newProjects));
    const newUsers = await api.users.fetchUsers();
    dispatch(setUsers(newUsers));
    setModalOpen(false);
    dispatch(setMessage(`${formInputData.title} has been successfully edited`));
  };

  const handleModalClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setModalOpen(false);
  };

  return (
    <>
      {isAdminUser ? (
        <>
          <Button onClick={handleModalOpen}>Edit Project</Button>
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
                defaultValue={formInputData.title}
                onChange={handleInputChange}
                id="title"
              />
              <TextField
                required
                id="description"
                label="Description"
                description={formInputData.description}
                minRows={8}
                defaultValue={formInputData.description}
                onChange={handleInputChange}
                //multiline
                //error comes when multiline is added
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
                        <Chip key={value} avatar={<Avatar></Avatar>} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {availableMembers.map((user) => (
                    <MenuItem
                      key={user._id}
                      value={user._id}
                      label={user.email}
                    >
                      <Checkbox
                        checked={formInputData.members.includes(user._id)}
                      />
                      <ListItemText key={user._id} primary={user.email} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                id="start"
                label="Start"
                name="start"
                type="date"
                defaultValue={dayjs(formInputData.startDate).format(
                  "YYYY-MM-DD"
                )}
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
                defaultValue={dayjs(formInputData.deadline).format(
                  "YYYY-MM-DD"
                )}
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
                variant="contained"
                onClick={(e) => {
                  handleFormSubmit(e);
                }}
              >
                Submit
              </Button>
            </Box>
          </Modal>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default EditProjectModal;
