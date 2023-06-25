import dayjs from "dayjs";
const BugsTableBody = ({ bugs }) => {
  return (
    <>
      {bugs.map((bug) => (
        <tr key={bug._id}>
          <td>{bug.title}</td>
          <td>{bug.description}</td>
          <td>{bug.priority}</td>
          <td>{bug.status}</td>
          <td>{dayjs(bug.deadline).format("YYYY-MM-DD")}</td>
          <td className="flex-column gap-md">
            <a href={`/bugs/${bug._id}`}> See Details</a>
          </td>
        </tr>
      ))}
    </>
  );
};

export default BugsTableBody;
