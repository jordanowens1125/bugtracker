import Input from "../Shared/GeneralInput";
import TextArea from "../Shared/TextArea";
import Buttons from "../Shared/Buttons";
import SelectByField from "../Shared/SelectByField";
import dayjs from "dayjs";
import MultiSelect from "../Shared/MultiSelect";
import Select from "../Shared/Select";
import { statusList } from "../../constants/projects";

const EditProjectModal = ({
  handleSubmit,
  handleChange,
  handleCancel,
  edit,
  developers,
  handleDevSelect,
  projectManagers,
  selected,
}) => {

  
  return (
    <div className="modal">
      <form className="modal-content" onSubmit={handleSubmit}>
        <h2>Edit Project</h2>
        <Input
          label={"Title"}
          value={edit.title}
          onChange={handleChange}
          id={"title"}
        />
        <TextArea
          id="description"
          label={"Description"}
          value={edit.description}
          onChange={handleChange}
        />
        <SelectByField
          label={"Project Manager"}
          id={"projectManager"}
          listofOptions={projectManagers}
          value={edit.projectManager}
          field={"_id"}
          displayfield={"name"}
          placeholder={"Select a project manager"}
          onChange={handleChange}
        />
        <Input
          label={"Deadline"}
          value={dayjs(edit.deadline).format("YYYY-MM-DD")}
          onChange={handleChange}
          id={"deadline"}
          type={"date"}
        />
        {/* <Select
          // value={edit.status}
          listOfOptions={statusList}
          label={'Status'}
        /> */}
        <MultiSelect
          listOfOptions={developers}
          label={"Developers"}
          field={"_id"}
          displayfield={"name"}
          onChange={handleDevSelect}
          selected={selected}
        />
        <Buttons
          secondary={"Cancel"}
          secondaryFunction={handleCancel}
          submit={"Submit"}
        />
      </form>
    </div>
  );
};

export default EditProjectModal;
