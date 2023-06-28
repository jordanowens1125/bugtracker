import NoData from "../Shared/NoData";
import Table from "../Shared/Table";

const TicketTable = (tickets) => {
  return (
    <>
      {tickets.map((ticket) => (
        <tr key={ticket._id}>
          <td>{ticket.title}</td>
          <td>{ticket.status}</td>
          <td>{ticket.priority}</td>
          <td className="flex-column gap-md">
            <a href={`/tickets/${ticket._id}`}>Details</a>
          </td>
        </tr>
      ))}
    </>
  );
};

const TicketTableContent = (tickets) => {
  const result = {
    false: <NoData title={"Tickets"} caption={"Tickets"} />,
    true: (
      <Table
        headings={["Title", "Status", "Priority"]}
        content={TicketTable(tickets)}
        caption={"Tickets"}
      />
    ),
  };
  return result[tickets.length > 0];
};

export default TicketTableContent;
