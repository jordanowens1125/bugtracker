import NoData from "../Shared/NoData";
import Table from "../Shared/Table";

const ProjectTable = (members, isUserAdmin) => {
  return (
    <>
      {members.map((member) => (
        <tr key={member._id}>
          <td>{member.name}</td>
          <td>{member.email}</td>
          <td>{member.role}</td>
          <td>
            {isUserAdmin && <a href={`/profile/${member._id}`}>Details</a>}
          </td>
        </tr>
      ))}
    </>
  );
};

const ProjectTableBodyContent = (members, isUserAdmin) => {
  const result = {
    false: <NoData title={"Developers"} caption={"Developers"} />,
    true: (
      <Table
        headings={["Name", "Email", "Role"]}
        content={ProjectTable(members, isUserAdmin)}
        caption={"Developers"}
      />
    ),
  };
  return result[members.length > 0];
};

export default ProjectTableBodyContent;
