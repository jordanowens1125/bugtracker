import dayjs from "dayjs";
const BugsTableBody = ({ tickets }) => {
  return (
    <>
      {tickets.map((ticket) => (
        <tr key={ticket._id}>
          <td>{ticket.title}</td>
          <td>{ticket.description}</td>
          <td>{ticket.priority}</td>
          <td>{ticket.status}</td>
          <td>{dayjs(ticket.deadline).format("YYYY-MM-DD")}</td>
          <td className="flex-column gap-md">
            <a href={`/tickets/${ticket._id}`}> See Details</a>
          </td>
        </tr>
      ))}
    </>
  );
};

export default BugsTableBody;
