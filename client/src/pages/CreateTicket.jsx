import { useEffect, useState } from "react";
import Input from "../components/Shared/GeneralInput";
import dayjs from "dayjs";
import { priorities } from "../constants/ticket";
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
  projectID: "",
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
    try {
      await api.tickets.createTicket(user, copy);
      messageInfo.dispatch({
        type: "SHOW",
        payload: `Successfully created ticket ${ticket.title}.`,
      });
      setTicket(initialTicketState);
      document.getElementById("projectID").value = -1;
    } catch (error) {
      setError(`Ticket Creation Unsuccessful: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.projects.fetchProjects(user);
        setProjects(response);
        if (response.length === 0) {
          setError(
            "Currently unable to create tickets because there are no projects available."
          );
        }
      } catch (error) {
        setError(
          `Currently unable to create tickets because of the following error: ${error.message}`
        );
      }
    };
    fetchData();
  }, [user]);

  return (
    <main className="full-height">
      <form className="full-height flex-column page" onSubmit={handleSubmit}>
        <h1>Create Ticket</h1>
        {error && <Error text={error} />}
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
          disabled={noprojects}
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
          placeholder={"No Project Selected"}
        />
        <Buttons submit={"Submit"} disabled={projects.length === 0} />
      </form>
    </main>
  );
};

export default CreateTicket;
