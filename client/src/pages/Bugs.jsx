import BugsTable from "../components/Bugs/BugsTable/BugsTable";

const Bugs = () => {
  return (
    <>
      <div className="flex-column gap-md p-md">
        <h1>Bugs</h1>
        <BugsTable />
      </div>
    </>
  );
};

export default Bugs;
