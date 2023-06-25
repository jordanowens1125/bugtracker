import Input from "../Shared/GeneralInput";
import TextArea from "../Shared/TextArea";
import Select from "../Shared/Select";
import dayjs from "dayjs";
import Buttons from "../Shared/Buttons";
import { statusList, priorities } from "../../constants/bug";

const EditBugModal = ({
  updattedBug,
  handleInputChange,
  reset,
  users,
  index,
  handleSubmit,
}) => {
  return (
    <div className="modal">
      <form className="modal-content" onSubmit={handleSubmit}>
        <h1>Edit Bug</h1>
        <Input
          value={updattedBug.title}
          onChange={handleInputChange}
          placeholder="Title..."
          label={"Title"}
        />
        <label htmlFor="title">Assigned To: </label>
        <select name="assignedTo" value={index} onChange={handleInputChange}>
          {users.length > 0 ? (
            <>
              <option value={-1}>Not Assigned</option>
              {users.map((user, index) => {
                return (
                  <option key={user._id} value={index}>
                    {user.name}
                  </option>
                );
              })}
            </>
          ) : (
            <>
              <option value="">No users</option>
            </>
          )}
        </select>
        <TextArea
          label={"Description"}
          value={updattedBug.description}
          onChange={handleInputChange}
          id={"description"}
        />
        <Select
          label={"Priority"}
          id={"priority"}
          value={updattedBug.priority}
          onChange={handleInputChange}
          listofOptions={priorities}
        />
        <Select
          label={"Status"}
          id={"status"}
          value={updattedBug.status}
          onChange={handleInputChange}
          listofOptions={statusList}
        />
        <Input
          value={dayjs(updattedBug.deadline).format("YYYY-MM-DD")}
          onChange={handleInputChange}
          label={"Deadline"}
          type="date"
          id="deadline"
        />
        <Buttons
          secondary={"Cancel"}
          secondaryFunction={reset}
          submit={"Submit"}
        />
      </form>
    </div>
  );
};

export default EditBugModal;
