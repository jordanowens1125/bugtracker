import { useEffect, useState } from "react";
import Input from "../components/Shared/GeneralInput";
import dayjs from "dayjs";
import { priorities } from "../constants/bug";
import useAuthContext from "../hooks/useAuthContext";
import api from "../api";
import useMessageContext from "../hooks/messageContext";

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
    await api.bugs.createBug(user, ticket);
    messageInfo.dispatch({
      type: "SHOW",
      payload: `Successfully created ticket ${ticket.title} .`,
    });
    setTicket(initialTicketState);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.projects.fetchProjects(user);
      setProjects(response);
      setTicket({ ...ticket, projectID: response[0]._id });
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
        <span className="error">
          Currently unable to create tickets because there are no projects
          available.
        </span>
      )}
      <Input
        value={ticket.title}
        label={"Title"}
        onChange={handleInputChange}
        id={"title"}
        disabled={noprojects}
      />
      <label htmlFor="title">Description: </label>
      <textarea
        type="text"
        rows="4"
        value={ticket.description}
        onChange={handleInputChange}
        name="description"
        required
        disabled={noprojects}
      />
      <label htmlFor="title">Priority: </label>
      <select
        name="priority"
        value={ticket.priority}
        onChange={handleInputChange}
        disabled={noprojects}
      >
        {priorities.map((priority) => {
          return (
            <option value={priority} key={priority}>
              {priority}
            </option>
          );
        })}
      </select>
      <Input
        value={dayjs(ticket.deadline).format("YYYY-MM-DD")}
        label={"Deadline"}
        onChange={handleInputChange}
        type={"date"}
        id={"deadline"}
        disabled={noprojects}
      />
      <label htmlFor="title">Project: </label>
      <select
        name="projectID"
        value={ticket.projectID}
        onChange={handleInputChange}
        required
        disabled={noprojects}
      >
        {projects.map((project) => {
          return (
            <option value={project._id} key={project._id}>
              {project.title}
            </option>
          );
        })}
      </select>

      <span className="flex">
        <button
          className="button-primary"
          type="submit"
          disabled={projects.length === 0}
        >
          Submit
        </button>
      </span>
    </form>
  );
};

export default CreateTicket;
