import React, { useState } from "react";
import { roles } from "../../constants/user";
import { useCreateUser } from "../../hooks/createUser";
import Eye from "../../assets/Eye";
import EyeHide from "../../assets/EyeHide";
import useMessageContext from "../../hooks/messageContext";
import Input from "../../components/Shared/GeneralInput";
import Select from "../../components/Shared/Select";

const Button = ({ onClick, content, submit, disabled }) => {
  return (
    <button
      type={submit ? "submit" : "button"}
      onClick={onClick}
      className="password-view flex aic jcc"
    >
      {content}
    </button>
  );
};

const CreateUserModal = ({ cancel }) => {
  const [role, setRole] = useState("Developer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [viewPassword, setViewPassword] = useState(false);
  const { signup, error, isLoading } = useCreateUser();
  const messageInfo = useMessageContext();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const responseOk = await signup(email, password, role, name);
    if (responseOk) {
      messageInfo.dispatch({
        type: "SHOW",
        payload: `${name} has been successfully created.`,
      });
      setName("");
      setEmail("");
      setPassword("");
    }
  };
  return (
    <div className="modal">
      <form className="modal-content" onSubmit={handleSubmit}>
        <h1> Create New User</h1>
        <Input
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          label={"Name"}
          type={"text"}
        />
        <Input
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          label={"Email"}
          type={"email"}
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          label={"Password"}
          type={viewPassword ? "text" : "password"}
          content={
            <Button
              type="button"
              onClick={() => setViewPassword(!viewPassword)}
              content={viewPassword ? <Eye /> : <EyeHide />}
            />
          }
        />
        <Select
          label={"User Role"}
          value={role}
          onChange={(e) => setRole(e.currentTarget.value)}
          listofOptions={roles}
        />
        {error && <span className="error full-width text-align">{error}</span>}
        <span className="flex">
          <button type="submit" className="button-primary" disabled={isLoading}>
            Create User
          </button>
          <button type="button" className="button-secondary" onClick={cancel}>
            Cancel
          </button>
        </span>
      </form>
    </div>
  );
};

export default CreateUserModal;
