import Input from "../Shared/GeneralInput";
import TextArea from "../Shared/TextArea";
import SelectByField from "../Shared/SelectByField";
import Select from "../Shared/Select";
import dayjs from "dayjs";
import Buttons from "../Shared/Buttons";
import { priorities } from "../../constants/bug";

const CreateTicketModal = ({
  project,
  bug,
  onSubmit,
  handleInputChange,
  cancel,
}) => {
  return (
    <div className="modal">
      <form className="modal-content" onSubmit={onSubmit}>
        <h2>New Bug</h2>
        <h3>Project: {project.title}</h3>
        <Input
          id={"title"}
          value={bug.title}
          onChange={handleInputChange}
          label={"Title"}
        />
        <TextArea
          value={bug.description}
          onChange={handleInputChange}
          id={"description"}
          label={"Description"}
        />
        <SelectByField
          value={bug.assignedTo}
          id={"assignedTo"}
          label={"Assigned To"}
          onChange={handleInputChange}
          placeholder={"Not Assigned"}
          listofOptions={project.members}
          displayfield={"name"}
          field={"_id"}
          required={false}
        />
        <Select
          label={"Priority"}
          name={"priority"}
          value={bug.priority}
          onChange={handleInputChange}
          listofOptions={priorities}
        />
        <Input
          label={"Deadline"}
          type="date"
          id="deadline"
          value={dayjs(bug.deadline).format("YYYY-MM-DD")}
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
