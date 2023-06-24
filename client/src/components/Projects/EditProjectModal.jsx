import Input from "../Shared/GeneralInput";

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
        <span className="flex-column">
          <label htmlFor="Description">Description:</label>
          <textarea
            name="description"
            id="description"
            cols="30"
            rows="5"
            placeholder="Description..."
            value={edit.description}
            onChange={handleChange}
            required
          ></textarea>
        </span>
        <span className="flex gap-md">
          <button
            className="button-secondary"
            onClick={handleCancel}
            type="button"
          >
            Cancel
          </button>
          <button type="submit" className="button-primary">
            Submit
          </button>
        </span>
      </form>
    </div>
  );
};

export default EditProjectModal;
