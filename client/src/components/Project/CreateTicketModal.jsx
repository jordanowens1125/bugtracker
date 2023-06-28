import Input from "../Shared/GeneralInput";
import TextArea from "../Shared/TextArea";
import SelectByField from "../Shared/SelectByField";
import Select from "../Shared/Select";
import dayjs from "dayjs";
import Buttons from "../Shared/Buttons";
import { priorities } from "../../constants/ticket";

const CreateTicketModal = ({
  project,
  ticket,
  onSubmit,
  handleInputChange,
  cancel,
}) => {
  return (
    <div className="modal">
      <form className="modal-content" onSubmit={onSubmit}>
        <h2>New Ticket</h2>
        <h3>Project: {project.title}</h3>
        <Input
          id={"title"}
          value={ticket.title}
          onChange={handleInputChange}
          label={"Title"}
        />
        <TextArea
          value={ticket.description}
          onChange={handleInputChange}
          id={"description"}
          label={"Description"}
        />
        <SelectByField
          value={ticket.assignedTo}
          id={"assignedTo"}
          label={"Assigned To"}
          onChange={handleInputChange}
          placeholder={"Not Assigned"}
          listofOptions={project.members.filter((user) => user.role === "Developer")}
          displayfield={"name"}
          field={"_id"}
          required={false}
        />
        <Select
          label={"Priority"}
          name={"priority"}
          id={'priority'}
          placeholder={'Select a priority'}
          value={ticket.priority}
          onChange={handleInputChange}
          listofOptions={priorities}
        />
        <Input
          label={"Deadline"}
          type="date"
          id="deadline"
          value={dayjs(ticket.deadline).format("YYYY-MM-DD")}
          onChange={handleInputChange}
        />
        <Buttons
          secondary={"Cancel"}
          secondaryFunction={cancel}
          submit={"Submit"}
        />
      </form>
    </div>
  );
};

export default CreateTicketModal;
