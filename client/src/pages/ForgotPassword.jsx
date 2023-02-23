import React from "react";
import Container from "@mui/material/Container";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
const ForgotPassword = () => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const auth = getAuth();
  const handleChange = (e) => {
    setEmail(e.target.value);
  };
  const submitPasswordResetRequest = async (e) => {
    setMessage("");
    setError("");
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email).then(() => {
        setEmail("");
        setMessage("Email was sent to reset password!");
      });
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            paddingTop: "20%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <div>
            Lost your password? Please enter your username or email address. You
            will receive a link to create a new password via email.
          </div>
          {message && (
            <Alert variant="outlined" color="success">
              {message}
            </Alert>
          )}
          {error && (
            <Alert variant="filled" color="error">
              {error}
            </Alert>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={handleChange}
            autoFocus
          />
          <Button onClick={submitPasswordResetRequest} variant="contained">
            Reset Password
          </Button>
          {message && (
            <Link href="/signin" variant="body2">
              Back To Sign In
            </Link>
          )}
          <Link href="/signin" variant="body2">
            Remember password?
          </Link>
        </Box>
      </Container>
    </>
  );
};

export default ForgotPassword;
