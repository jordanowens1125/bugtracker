import NoData from "../Shared/NoData";
import Table from "../Shared/Table";

const BugTable = (bugs) => {
  return (
    <>
      {bugs.map((bug) => (
        <tr key={bug._id}>
          <td>{bug.title}</td>
          <td>{bug.status}</td>
          <td>{bug.priority}</td>
          <td className="flex-column gap-md">
            <a href={`/bugs/${bug._id}`}>Details</a>
          </td>
        </tr>
      ))}
    </>
  );
};

const BugTableContent = (bugs) => {
  const result = {
    false: <NoData title={"Bugs"} caption={"Bugs"} />,
    true: (
      <Table
        headings={["Title", "Status", "Priority"]}
        content={BugTable(bugs)}
        caption={"Bugs"}
      />
    ),
  };
  return result[bugs.length > 0];
};

export default BugTableContent;
