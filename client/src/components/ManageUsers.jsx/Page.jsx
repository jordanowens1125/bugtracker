import Select from "../Shared/Select";
import NoData from "../Shared/NoData";
import Table from "../Shared/Table";
import UserTableBody from "./UserTableBody";
import { roles } from "../../constants/user";
const ManageUsersPage = ({
  setRole,
  handleSubmit,
  count,
  setCreateMode,
  setDeleteMode,
  filtered,
  role,
  handleRowClick,
}) => {
  return (
    <div className="page flex-column">
      <div className="flex aic mobile-column">
        <h1>Manage Users</h1>
        <p>
          <i className="primary">*</i>Demo users can not be altered
        </p>
      </div>

      {/* <span className="flex gap-md search mobile-column">
            <input type="text" placeholder="Search for member" />
            <button className="button-secondary" type="button">
              Clear
            </button>
          </span> */}
      <span className="flex mobile-column w-content">
        <Select
          label={" New role to be assigned to selected users:"}
          onChange={(e) => setRole(e.currentTarget.value)}
          value={role}
          listofOptions={roles}
        />
      </span>
      <span className="flex gap-md space-between mobile-column">
        <span className="flex mobile-column">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={count === 0}
            className="button-primary"
          >
            Update Users Roles
          </button>
          <button
            type="button"
            onClick={() => setCreateMode(true)}
            className="button-secondary"
          >
            Create New User
          </button>
        </span>

        <button
          type="button"
          onClick={() => setDeleteMode(true)}
          disabled={count === 0}
          className="button-delete"
        >
          Delete Users
        </button>
      </span>

      <div className="overflow-x only-full-width">
        {filtered.length > 0 ? (
          <Table
            headings={["", "Name", "Email", "Role", "More"]}
            content={UserTableBody(filtered, handleRowClick)}
            caption={"Select Users to Edit"}
          />
        ) : (
          <NoData title={"Users"} />
        )}
      </div>
    </div>
  );
};

export default ManageUsersPage;