import React, { useState } from "react";
import { roles } from "../constants/user";
import { useCreateUser } from "../hooks/createUser";
import { useDispatch } from "react-redux";
import { setMessage } from "../redux/actions/messageActions";
import Eye from '../assets/Eye'
import EyeHide from '../assets/EyeHide'

const CreateUser = () => {
  const [role, setRole] = useState("Developer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [viewPassword, setViewPassword] = useState(false);
  const { signup, error, isLoading } = useCreateUser();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const responseOk = await signup(email, password, role, name);
    if (responseOk) {
      dispatch(setMessage(`${name} has been successfully created.`));
      setName("");
      setEmail("");
      setPassword("");
    }
  };
  return (
    <form
      className="flex-column max-w-lg mobile-column page"
      onSubmit={handleSubmit}
    >
      <h1> Create User</h1>
      <label htmlFor="Name">Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        required
        className="full-width"
      />
      <label htmlFor="Email">Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        required
        className="full-width"
      />
      <label htmlFor="Password">Password:</label>
      <div className="flex full-width gap-0 jcc">
        <input
          type={viewPassword ? "text" : "password"}
          required
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          aria-label="Password"
          className="grow"
        />
        <button
          type="button"
          onClick={() => setViewPassword(!viewPassword)}
          className="password-view flex aic jcc"
        >
          {viewPassword ? <Eye /> : <EyeHide />}
        </button>
      </div>
      <label htmlFor="Role">User Role:</label>
      <span className="full-width">
        <select
          name="Role"
          id="Role"
          onChange={(e) => setRole(e.currentTarget.value)}
          value={role}
          className="full-width"
        >
          {roles.map((role) => (
            <option value={role} key={role}>
              {role}
            </option>
          ))}
        </select>
      </span>
      {error && <span className="error full-width text-align">{error}</span>}
      <span className="full-width">
        <button
          type="submit"
          className="button-primary full-width"
          disabled={isLoading}
        >
          Create User
        </button>
      </span>
    </form>
  );
};

export default CreateUser;
