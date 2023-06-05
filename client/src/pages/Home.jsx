import UserDashboard from "../components/Users/UserDashboard";
import useAuthContext from "../hooks/useAuthContext";

const Home = () => {
  const { user } = useAuthContext();
  return (
    <>
      <UserDashboard user={user} />
    </>
  );
};

export default Home;
