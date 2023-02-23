import React, { useState, useEffect } from "react";
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
import { useTheme } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import { setBugs, selectedBug } from "../../../redux/actions/bugActions";
import {
  selectedProject,
  setProjects,
} from "../../../redux/actions/projectActions";
import { setUsers } from "../../../redux/actions/userActions";
import { setComments } from "../../../redux/actions/commentActions";
import { setMessage } from "../../../redux/actions/messageActions";

const style = {
  position: "absolute",
  display: 'flex',
  flexDirection: 'column',
  gap:'10px',
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const checkifCurrentProjectIsFilled = (obj) => {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return true;
  }
  return false;
};

const checkIfCurrentProjectHasMembers = (obj) => {
  if (obj.members) {
    if (obj.members.length > 0) {
      return true;
    }
  } else {
    return false;
  }
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

const priorities = ["Low", "Medium", "High"];

const CreateBugModal = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const projects = useSelector((state) => state.allProjects.projects);
  const currentProject = useSelector((state) => state.project);
  const isThereACurrentProject = checkifCurrentProjectIsFilled(currentProject);
  const currentProjectHasMembers =
    checkIfCurrentProjectHasMembers(currentProject);
  const bugs = useSelector((state) => state.allBugs.bugs);
  const theme = useTheme();
  const dispatch = useDispatch();
  const [formInputData, setFormInputData] = useState({
    title: "", //set by user, can be updated *
    creator: "", //auto
    description: "", //set by user, can be updated *
    status: "Open", //can be updated *
    projectID: "", //set by user *
    closer: "", //auto
    openDate: dayjs(new Date()).format("YYYY-MM-DD"), //set by user-optionally
    closeDate: "", //auto
    history: [], //auto
    relatedBugs: [], //set by user optionally, can be updated
    stepsToRecreate: [], //set by user, can be updated
    priority: "Low", //set by user, can be updated *
    assignedTo: [], //can be updated
    comments: [],
  });
  useEffect(() => {
    if (isThereACurrentProject) {
      const newInputValue = { ...formInputData };
      newInputValue.projectID = currentProject._id;
      setFormInputData(newInputValue);
    } else {
      //clear the project section of modal
      const newInputValue = { ...formInputData };
      newInputValue.projectID = "";
      setFormInputData(newInputValue);
    }
  }, [currentProject]);
  const handleInputChange = (e) => {
    const inputFieldValue = e.target.value;
    const inputFieldName = e.target.id || e.target.name; //target name for the bugs select
    //if name is start or deadline change format to string
    const newInputValue = {
      ...formInputData,
      [inputFieldName]: inputFieldValue,
    };
    setFormInputData(newInputValue);
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let resetFormData = {
      title: "",
      description: "",
      status: "Open",
      projectID: "",
      creator: "",
      closer: "",
      openDate: dayjs(new Date()).format("YYYY-MM-DD"),
      closeDate: "",
      history: [],
      relatedBugs: [],
      stepsToRecreate: [],
      priority: "Low",
      assignedTo: [],
    };
    const response = await api.bugs.createBug(formInputData);
    if (response.assignedTo !== "") {
      const newUsers = await api.users.fetchUsers();
      dispatch(setUsers(newUsers));
      dispatch(selectedBug(response));
      const updatedComments = await api.comments.fetchBugComments(response._id);
      dispatch(setComments(updatedComments));
    } else {
      dispatch(selectedBug(formInputData));
    }
    const newBugs = await api.bugs.fetchBugs();
    dispatch(setBugs(newBugs));
    const newProjects = await api.projects.fetchProjects();
    dispatch(setProjects(newProjects));
    setModalOpen(false);
    setFormInputData({ ...resetFormData });
    //updatedProject returns project and available members from backend as object
    const updatedProject = await api.projects.fetchProject(currentProject._id);
    dispatch(selectedProject(updatedProject.project));
    dispatch(setMessage(`Bug ${formInputData.title} was successfully created!`));
  };
  const handleModalClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setModalOpen(false);
  };
  return (
    <>
      <Button onClick={handleModalOpen}>Create Bug</Button>
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
              defaultValue=""
              title={formInputData.title}
              onChange={handleInputChange}
              id="title"
            />
            <TextField
              required
              id="description"
              label="Description"
              description={formInputData.description}
              minRows={8}
              defaultValue=""
              onChange={handleInputChange}
              multiline
              //error comes when multiline is added
            />
            <FormControl  disabled>
              <InputLabel id="demo-multiple-name-label">Project</InputLabel>
              <Select
                id="projectID"
                name="projectID"
                value={formInputData.projectID}
                onChange={handleInputChange}
                input={<OutlinedInput label="Project" />}
                required
              >
                {projects.map((project) => (
                  <MenuItem key={project._id} value={project._id}>
                    {project.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {currentProjectHasMembers ? (
              <FormControl >
                <InputLabel id="demo-multiple-name-label">Assign To</InputLabel>
                <Select
                  id="assignedTo"
                  name="assignedTo"
                  value={formInputData.assignedTo}
                  onChange={handleInputChange}
                  input={<OutlinedInput label="Assigned To" />}
                >
                  {}
                  <MenuItem value="">None</MenuItem>
                  {currentProject.members.map((member) => (
                    <MenuItem key={member._id} value={member._id}>
                      {member.email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <FormControl >
                <InputLabel id="demo-multiple-name-label">Assign To</InputLabel>
                <Select
                  id="assignedTo"
                  name="assignedTo"
                  value={""}
                  input={<OutlinedInput label="Assigned To" />}
                >
                  {
                    <MenuItem value={""}>
                      {"No members are on this project"}
                    </MenuItem>
                  }
                </Select>
              </FormControl>
            )}
            <FormControl >
              <InputLabel id="demo-multiple-name-label">Priority</InputLabel>
              <Select
                id="priority"
                name="priority"
                value={formInputData.priority}
                onChange={handleInputChange}
                input={<OutlinedInput label="Priority" />}
                required
              >
                {priorities.map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    {priority}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl >
              <InputLabel id="demo-multiple-chip-label">
                Related bugs
              </InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="relatedBugs"
                name={"relatedBugs"}
                multiple
                value={formInputData.relatedBugs} //set to current bugsName list
                onChange={handleInputChange}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {bugs.map((bug) => (
                  <MenuItem
                    key={bug._id}
                    value={bug._id}
                    style={getStyles(bug, bug.title, theme)}
                  >
                    {bug.title}
                  </MenuItem>
                ))}
              </Select>
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
  );
};

export default CreateBugModal;
