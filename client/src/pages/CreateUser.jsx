import React, { useState } from "react";
import { roles } from "../constants/user";
import { useCreateUser } from "../hooks/createUser";
import { useDispatch } from "react-redux";
import { setMessage } from "../redux/actions/messageActions";

const CreateUser = () => {
  const [role, setRole] = useState("Developer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error, isLoading } = useCreateUser();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const responseOk = await signup(email, password, role, name);
    if (responseOk) {
      dispatch(
        setMessage(
          `${name} has been successfully created.`
        )
      );
      setName('')
      setEmail('')
      setPassword('')
    }
  };
  return (
    <form className="flex-column max-w-lg mobile-column p-top-md" onSubmit={handleSubmit}>
      <h1> Create User</h1>
      <label htmlFor="Name">Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        required
      />
      <label htmlFor="Email">Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        required
      />
      <label htmlFor="Password">Password:</label>
      <input
        type="text"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
        required
      />
      <label htmlFor="Role">User Role:</label>
      <span>
        <select
          name="Role"
          id="Role"
          onChange={(e) => setRole(e.currentTarget.value)}
          value={role}
        >
          {roles.map((role) => (
            <option value={role} key={role}>
              {role}
            </option>
          ))}
        </select>
      </span>
      {error && <span className="error full-width text-align">{error}</span>}
      <span>
        <button type="submit" className="button-primary" disabled={isLoading}>
          Create User
        </button>
      </span>
    </form>
  );
};

export default CreateUser;
