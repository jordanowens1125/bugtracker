const PMTableContent = (tickets, project) => {
  return (
    <>
      {tickets.map((ticket) => (
        <tr key={ticket._id}>
          <td>{ticket.title}</td>
          <td>{ticket.description}</td>
          <td>{ticket.priority}</td>
          <td>{ticket.status}</td>
          <td>{project.title}</td>
          <td>{ticket.assignedTo ? <>{ticket.assignedTo.name}</> : <>N/A</>}</td>
          <td className="flex-column gap-md">
            <a href={`/tickets/${ticket._id}`}>
              {" "}
              Details
            </a>
          </td>
        </tr>
      ))}
    </>
  );
};

export default PMTableContent;
