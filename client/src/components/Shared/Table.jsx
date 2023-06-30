const Table = ({ headings, content, caption, alignAlways }) => {
  return (
    <>
      {" "}
      <p className="caption">{caption}</p>
      <div
        className={`mobile-text-align flex-column overflow-x only-full-width`}
      >
        <table className="p-md full-width mobile-text-align h-lg overflow-y overflow-x">
          <thead>
            <tr>
              {headings.map((heading) => (
                <th key={heading}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>{content}</tbody>
        </table>
      </div>
    </>
  );
};

export default Table;
