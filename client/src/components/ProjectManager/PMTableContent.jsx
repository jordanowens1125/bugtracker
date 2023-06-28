const PMTableContent = (bugs, project) => {
  return (
    <>
      {bugs.map((bug) => (
        <tr key={bug._id}>
          <td>{bug.title}</td>
          <td>{bug.description}</td>
          <td>{bug.priority}</td>
          <td>{bug.status}</td>
          <td>{project.title}</td>
          <td>{bug.assignedTo ? <>{bug.assignedTo.name}</> : <>N/A</>}</td>
          <td className="flex-column gap-md">
            <a href={`/bugs/${bug._id}`} onClick={() => console.log(bug)}>
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
