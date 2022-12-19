import CreateBugModal from "../components/Bugs/CreateBugModal/CreateBugModal";
import BugsTable from '../components/Bugs/BugsTable/BugsTable'

const Bugs = () => {
    return (
      <>
        <h1>Bugs</h1>
        <CreateBugModal/>
        <BugsTable/>
      </>
      
    )
    
  };
  
  export default Bugs;