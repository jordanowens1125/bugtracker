import { useEffect, useState } from "react";
import useAuthContext from "../hooks/useAuthContext";
import { useParams } from "react-router-dom";
import api from "../api";
import dayjs from "dayjs";

const state = {
  _id: "",
  email: "",
  name: "",
  role: "",
  joinedDate: "",
};

const Profile = () => {
  const { user } = useAuthContext();
  const userID = useParams().id || user._id;
  const [info, setInfo] = useState(state);
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const fetchedUser = await api.users.fetchUser(user, userID);
        const { _id, email, name, role, joinedDate } = fetchedUser;
        setInfo({
          _id,
          email,
          name,
          role,
          joinedDate,
        });
      } catch (error) {}
    };
    fetchUserInfo();
  }, [user, userID]);
  return (
    <div className="page flex-column aic jcc full-height">
      <div className="flex-column cover mobile-column">
        <h1 className="border-bottom full-width">{info.name}</h1>
        <p>ID:{info._id}</p>
        <p>Email: {info.email}</p>
        <p>Role: {info.role}</p>
        <p>Created Date: {dayjs(info.joinedDate).format("YYYY-MM-DD")}</p>
      </div>
    </div>
  );
};

export default Profile;
