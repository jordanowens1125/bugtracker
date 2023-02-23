import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import UserDashboard from "../components/Users/UserDashboard";
import { useUserAuth } from "../context/userAuthContext";

const Home = () => {
  const { user } = useUserAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user, navigate]);

  return (
    <>
      <UserDashboard />
    </>
  );
};

export default Home;
