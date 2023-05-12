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

const MAX_TITLE_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 200;

const style = {
  margin: "auto",
  width: "80%",
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

const EditProjectModal = ({project}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const user = useSelector((state) => state.currentUser);
  const isAdminUser = user.role === "Admin";
  const handleModalOpen = () => setModalOpen(true);
  const currentProject = project
  const users = useSelector((state) => state.allUsers.users)
  let availableMembers = users.filter(user => user.assignable === true && user.deleted === false && user.role === 'Developer')
  if (currentProject.members) {
    availableMembers = [ ...currentProject.members,...availableMembers,]
  }
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
    if (inputFieldName === "title" && inputFieldValue.length > MAX_TITLE_LENGTH)
      return;
    if (
      inputFieldName === "description" &&
      inputFieldValue.length > MAX_DESCRIPTION_LENGTH
    )
      return;
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
          <button className="button-primary" onClick={handleModalOpen}>
            Edit Project
          </button>

            {/* <Box sx={style}>
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
                aria-label="Submit edit project form"
                variant="contained"
                onClick={(e) => {
                  handleFormSubmit(e);
                }}
              >
                Submit
              </Button>
            </Box> */}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default EditProjectModal;
