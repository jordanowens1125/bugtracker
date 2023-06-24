import { useEffect, useState } from "react";
import useAuthContext from "../hooks/useAuthContext";
import { useParams } from "react-router-dom";
import api from "../api";

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
      const fetchedUser = await api.users.fetchUser(user, userID);
      const { _id, email, name, role, joinedDate } = fetchedUser;
      setInfo({
        _id,
        email,
        name,
        role,
        joinedDate,
      });
    };
    fetchUserInfo();
  }, [user, userID]);
  return (
    <div className="page border flex-column aic jcc">
      <p>{info._id}</p>
      <p>{info.email}</p>
      <p>{info.name}</p>
      <p>{info.role}</p>
      <p>{info.joinedDate}</p>
    </div>
  );
};

export default Profile;
