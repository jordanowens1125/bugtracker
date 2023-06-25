import React, { useEffect, useState } from "react";
import api from "../api/index";
import useAuthContext from "../hooks/useAuthContext";
import useMessageContext from "../hooks/messageContext";
import Input from "../components/Shared/GeneralInput";
import {
  initialState,
  MAX_DESCRIPTION_LENGTH,
  MAX_TITLE_LENGTH,
} from "../components/CreateProject/constants";
import SelectProjectManager from "../components/CreateProject/SelectProjectManager";
import MultiSelect from "../components/Shared/MultiSelect";
import TextArea from "../components/Shared/TextArea";
import Buttons from "../components/Shared/Buttons";

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
    console.log(NewInputValue);
    setFormInputData(NewInputValue);
  };

  const handleDeveloperSelect = (e) => {
    e.preventDefault();
    console.log(e.target.value);
  };

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
    <form className="page flex-column" onSubmit={handleFormSubmit}>
      <h1>Create Project</h1>
      <Input
        value={formInputData.title}
        onChange={handleInputChange}
        placeholder={`Character limit is ${MAX_TITLE_LENGTH}...`}
        label={"Title"}
        id={"title"}
      />
      <TextArea
        value={formInputData.description}
        onChange={handleInputChange}
        placeholder={`Character limit is ${MAX_DESCRIPTION_LENGTH}...`}
        label={"Description"}
        id={"description"}
      />
      <Input
        type="date"
        name="deadline"
        id="deadline"
        label={"Deadline Date"}
        value={formInputData.deadline}
        onChange={handleInputChange}
      />

      <SelectProjectManager
        list={available.filter((user) => user.role === "Project Manager")}
        label={"Project Manager"}
        onChange={handleInputChange}
        displayfield={"name"}
        id="projectManager"
        field={"_id"}
      />
      <MultiSelect
        label={"Developers"}
        id={"members"}
        listOfOptions={available.filter((user) => user.role === "Developer")}
        field={"_id"}
        displayfield={"name"}
        onChange={handleDeveloperSelect}
      />
      <Buttons
        secondary={"Reset"}
        secondaryFunction={reset}
        submit={"Submit"}
      />
    </form>
  );
};

export default CreateProject;
