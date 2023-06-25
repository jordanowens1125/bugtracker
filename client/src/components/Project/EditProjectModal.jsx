import Input from "../Shared/GeneralInput";
import TextArea from "../Shared/TextArea";
import Buttons from "../Shared/Buttons";

const EditProjectModal = ({
  handleSubmit,
  handleChange,
  handleCancel,
  edit,
}) => {
  return (
    <div className="modal">
      <form className="modal-content" onSubmit={handleSubmit}>
        <h2>Edit Project</h2>
        <Input
          label={"Title"}
          value={edit.title}
          onChange={handleChange}
          required={true}
          id={"title"}
        />
        <TextArea
          id="description"
          label={"Description"}
          value={edit.description}
          onChange={handleChange}
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
