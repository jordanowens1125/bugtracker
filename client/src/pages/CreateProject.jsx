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
import TextArea from "../components/Shared/TextArea";
import Buttons from "../components/Shared/Buttons";
import SelectByField from "../components/Shared/SelectByField";
import SelectedDevelopers from "../components/CreateProject/SelectedDevelopers";

const CreateProject = () => {
  const [available, setAvailable] = useState([]);
  const messageInfo = useMessageContext();
  const [formInputData, setFormInputData] = useState(initialState);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchData = async (user) => {
      try {
        const users = await api.users.fetchAvailableUsers(user);
        const filtered = users.filter(
          (user) => user.role !== "Deleted" && user.role !== "Admin"
        );
        setAvailable(filtered);
      } catch (error) {}
    };
    fetchData(user);
  }, [user]);

  const reset = () => {
    setFormInputData(initialState);
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

  const handleDeveloperSelect = (e, userID) => {
    const copy = { ...formInputData };
    if (e.target.classList.contains("selected")) {
      e.target.classList.remove("selected");
      delete copy.members[userID];
    } else {
      e.target.classList.add("selected");
      copy.members[userID] = true;
    }
    setFormInputData(copy);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    //change list of members to ids here
    const newInputValue = { ...formInputData };
    const memberIds = Object.keys(formInputData.members);
    const selectedIds = [...memberIds, newInputValue.projectManager];

    try {
      newInputValue["members"] = memberIds;
      await api.projects.createProject(user, newInputValue);
      messageInfo.dispatch({
        type: "SHOW",
        payload: `Project ${newInputValue.title} has been successfully created!`,
      });
      setFormInputData(initialState);

      //remove selected users
      const unSelectedUsers = available.filter(
        (user) => !selectedIds.find((id) => id === user._id)
      );

      setAvailable(unSelectedUsers);
    } catch (error) {}
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
      <SelectByField
        label={"Project Manager"}
        value={formInputData.projectManager}
        onChange={handleInputChange}
        field={"_id"}
        displayfield={"name"}
        id={"projectManager"}
        placeholder={"Select a Project Manager"}
        listofOptions={available.filter(
          (user) => user.role === "Project Manager"
        )}
      />
      <SelectedDevelopers
        developers={available.filter((user) => user.role === "Developer")}
        handleDeveloperSelect={handleDeveloperSelect}
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
