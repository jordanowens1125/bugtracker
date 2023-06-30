import dayjs from "dayjs";

const DevDashboardTable = (tickets, project) => {
  return (
    <>
      {tickets.map((ticket) => (
        <tr key={ticket._id}>
          <td>{ticket.title}</td>
          <td>{ticket.description}</td>
          <td>{ticket.priority}</td>
          <td>{ticket.status}</td>
          <td>{project.title}</td>
          <td>{dayjs(ticket.closeDate).format("MM-DD-YY")}</td>
          <td className="flex-column gap-md">
            <a href={`/tickets/${ticket._id}`}> See Details</a>
          </td>
        </tr>
      ))}
    </>
  );
};

export default DevDashboardTable;
