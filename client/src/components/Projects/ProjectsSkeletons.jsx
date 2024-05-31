import Table from "../Shared/Table";
import './ProjectsSkeleton.css'

export default function ProjectsSkeleton() {
  const Skeletons = () => {
    return Array.from({ length: 20 }, (_, i) => (
      <tr className="row" key={i}>
        <td className="skeleton"></td>
        <td className="skeleton"></td>
        <td className="skeleton"></td>
        <td className="skeleton"></td>
      </tr>
    ));
  };

  return (
    <Table
      headings={["Title", "Description", "Status", "More"]}
      content={<Skeletons />}
    />
  );
}
