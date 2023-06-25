import { useEffect, useState } from "react";
import Input from "../components/Shared/GeneralInput";
import dayjs from "dayjs";
import { priorities } from "../constants/bug";
import useAuthContext from "../hooks/useAuthContext";
import api from "../api";
import useMessageContext from "../hooks/messageContext";
import SelectByField from "../components/Shared/SelectByField";
import Buttons from "../components/Shared/Buttons";
import Select from "../components/Shared/Select";
import Error from "../components/Shared/Error";
import TextArea from "../components/Shared/TextArea";

const initialTicketState = {
  title: "",
  description: "",
  priority: "Low",
  status: "Open",
  deadline: dayjs(new Date()).format("YYYY-MM-DD"),
  projectID: undefined,
};

const CreateTicket = () => {
  const [projects, setProjects] = useState([]);
  const [ticket, setTicket] = useState(initialTicketState);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const messageInfo = useMessageContext();
  const noprojects = projects.length === 0;
  const handleInputChange = (e) => {
    const inputFieldValue = e.target.value;
    const inputFieldName = e.target.name || e.target.id;
    const NewInputValue = {
      ...ticket,
      [inputFieldName]: inputFieldValue,
    };
    setTicket(NewInputValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const copy = { ...ticket };
    copy.creator = user._id;
    await api.bugs.createBug(user, ticket);
    messageInfo.dispatch({
      type: "SHOW",
      payload: `Successfully created ticket ${ticket.title}.`,
    });
    setTicket(initialTicketState);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.projects.fetchProjects(user);
      setProjects(response);
      if (response.length === 0) {
        setError(
          "Currently unable to create tickets because there are no projects available."
        );
      }
    };
    fetchData();
  }, [user]);

  return (
    <form className="page flex-column" onSubmit={handleSubmit}>
      <h1>Create Ticket</h1>
      {error && (
        <Error
          text={
            "Currently unable to create tickets because there are no projects available."
          }
        />
      )}
      <Input
        value={ticket.title}
        label={"Title"}
        onChange={handleInputChange}
        id={"title"}
        disabled={noprojects}
      />
      <TextArea
        value={ticket.description}
        onChange={handleInputChange}
        id={"description"}
        label={"Description"}
      />
      <Select
        value={ticket.priority}
        id={"priority"}
        onChange={handleInputChange}
        listofOptions={priorities}
        disabled={noprojects}
        label={"Priority"}
      />
      <Input
        value={dayjs(ticket.deadline).format("YYYY-MM-DD")}
        label={"Deadline"}
        onChange={handleInputChange}
        type={"date"}
        id={"deadline"}
        disabled={noprojects}
      />
      <SelectByField
        label={"Project"}
        value={ticket.projectID}
        onChange={handleInputChange}
        disabled={noprojects}
        field={"_id"}
        displayfield={"title"}
        id={"projectID"}
        listofOptions={projects}
      />
      <Buttons submit={"Submit"} disabled={projects.length === 0} />
    </form>
  );
};

export default CreateTicket;
