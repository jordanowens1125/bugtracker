import Input from "../Shared/GeneralInput";
import TextArea from "../Shared/TextArea";
import Buttons from "../Shared/Buttons";
import MultiSelect from "../Shared/MultiSelect";
import SelectByField from "../Shared/SelectByField";
import dayjs from "dayjs";

const EditProjectModal = ({
  handleSubmit,
  handleChange,
  handleCancel,
  edit,
  developers,
  handleDevSelect,
  projectManagers,
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
        <Input
          label={"Deadline"}
          value={dayjs(edit.deadline).format("YYYY-MM-DD")}
          onChange={handleChange}
          id={"deadline"}
          type={"date"}
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
        {/* <MultiSelect
          label={"Developers"}
          onChange={handleDevSelect}
          listOfOptions={developers}
          displayfield={"name"}
          field={"_id"}
          id={'members'}
        /> */}
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
