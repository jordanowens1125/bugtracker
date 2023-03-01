import React, { useState, useMemo } from "react";
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
import { setMessage } from "../../../redux/actions/messageActions";

const MAX_TITLE_LENGTH = 15;
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

const priorities = ["Low", "Medium", "High"];

const EditBugModal = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const currentBug = useSelector((state) => state.currentBug);
  const project = useSelector((state) => state.project);
  const relativeBugs = project.bugs.filter((bug) => bug._id !== currentBug._id);
  const members = project.members || false;
  //we will use this project to populate the potential members who can
  //be assigned this project
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
  useMemo(async () => {
    if (currentBug.assignedTo) {
      const newInputValue = { ...currentBug };
      newInputValue.assignedTo = currentBug?.assignedTo.map((i) => i._id);
      setFormInputData(newInputValue);
    } else {
      setFormInputData(currentBug);
    }
  }, [currentBug]);

  const handleInputChange = (e) => {
    const inputFieldValue = e.target.value;
    const inputFieldName = e.target.id || e.target.name; //target name for the bugs select
    if (inputFieldName === "title" && inputFieldValue.length > MAX_TITLE_LENGTH)
      return;
    if (
      inputFieldName === "description" &&
      inputFieldValue.length > MAX_DESCRIPTION_LENGTH
    )
      return;
    const newInputValue = {
      ...formInputData,
      [inputFieldName]: inputFieldValue,
    };
    setFormInputData(newInputValue);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    //send bug to be updated
    const updatedBug = await api.bugs.updateBug(currentBug, formInputData);
    dispatch(selectedBug(updatedBug));
    //the backend brings back the project and available members objects so we will specify to dispatch just the project
    const updatedProject = await api.projects.fetchProject(project._id);
    dispatch(selectedProject(updatedProject.project));
    const newBugs = await api.bugs.fetchBugs();
    dispatch(setBugs(newBugs));
    const newProjects = await api.projects.fetchProjects();
    dispatch(setProjects(newProjects));
    const newUsers = await api.users.fetchUsers();
    dispatch(setUsers(newUsers));
    dispatch(
      setMessage(`Bug ${formInputData.title} was successfully updated!`)
    );
    setModalOpen(false);
  };

  const handleModalClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setModalOpen(false);
  };

  return (
    <>
      <>
        <Button
          sx={{ width: "100%" }}
          onClick={handleModalOpen}
          aria-label="Open form to edit bug"
        >
          Edit Bug
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
              defaultValue={formInputData.title}
              title={formInputData.title}
              onChange={handleInputChange}
              id="title"
              placeholder={`Character limit is ${MAX_TITLE_LENGTH}`}
            />
            <FormControl>
              <TextField
                required
                id="description"
                label="Description"
                description={formInputData.description}
                minRows={8}
                defaultValue={formInputData.description}
                onChange={handleInputChange}
                multiline
                placeholder={`Character limit is ${MAX_DESCRIPTION_LENGTH}`}
              />
            </FormControl>
            <FormControl>
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
            {members ? (
              <FormControl>
                <InputLabel id="demo-multiple-name-label">Assign To</InputLabel>
                <Select
                  id="assignedTo"
                  name="assignedTo"
                  value={formInputData.assignedTo || []}
                  onChange={handleInputChange}
                  input={<OutlinedInput label="assignedTo" />}
                >
                  <MenuItem key="" value="">
                    {"None"}
                  </MenuItem>
                  {members.map((member) => (
                    <MenuItem key={member._id} value={member._id}>
                      {member.email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <h1>loading</h1>
            )}

            <FormControl>
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
                {relativeBugs.map((bug) => (
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
              type="submit"
              value="Submit"
              variant="contained"
              aria-label="Submit edit form button"
              onClick={(e) => {
                handleFormSubmit(e);
              }}
            >
              Submit
            </Button>
          </Box>
        </Modal>
      </>
    </>
  );
};

export default EditBugModal;
