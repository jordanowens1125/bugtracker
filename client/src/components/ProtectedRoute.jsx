import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/userAuthContext";
import { useDispatch, useSelector } from "react-redux";
import { selectedUser } from "../redux/actions/userActions";
import Loading from "./Loading";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const ProtectedRoute = ({ user }) => {
  const location = useLocation();
  const users = useSelector((state) => state.allUsers.users);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const findUserWithUID = (user, users) => {
        if (user) {
          for (let i = 0; i < users.length; i++) {
            if (users[i].uid === user.uid) {
              dispatch(selectedUser(users[i]));
              return "";
            }
          }
        }
      };

      findUserWithUID(user, users);
    }
  }, [user, users, dispatch]);

  if (user === undefined) return <Loading />;

  return user ? (
      <Outlet />
  ) : (
    <Navigate to="/signin" replace state={{ from: location }} />
  );
};

export default ProtectedRoute;
