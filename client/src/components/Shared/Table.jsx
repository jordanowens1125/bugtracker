const Table = ({ headings, content, caption, alignAlways, fullHeight = true }) => {
  const height = {
    false: 'h-md',
    true: '',
  }
  const heightClass = height[fullHeight]
  return (
    <div className="relative">
      <p className="caption">{caption}</p>
      <div
        className={`mobile-text-align flex-column overflow-x only-full-width ${heightClass}`}
      >
        <table className="p-md full-width mobile-text-align h-lg overflow-y overflow-x relative">
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
    </div>
  );
};

export default Table;
