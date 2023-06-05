import useAuthContext from "../hooks/useAuthContext";
import { Navigate, useLocation } from "react-router-dom";

const Home = () => {
  const { user } = useAuthContext();
  const location = useLocation();
  return (
    <>
      {user.role === "Admin" && (
        <Navigate to="/admin" state={{ from: location }} replace />
      )}
      {user.role === "Developer" && (
        <Navigate to="/developer" state={{ from: location }} replace />
      )}
      {user.role === "Project Manager" && (
        <Navigate to="/projectmanager" state={{ from: location }} replace />
      )}
    </>
  );
};

export default Home;
