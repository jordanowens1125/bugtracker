const Table = ({ headings, content, caption }) => {
  return (
    <>
      <table className="p-md full-width mobile-text-align">
        <caption>{caption}</caption>
        <thead>
          <tr>
            {headings.map((heading) => (
              <th key={heading}>{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>{content}</tbody>
      </table>
    </>
  );
};

export default Table;
