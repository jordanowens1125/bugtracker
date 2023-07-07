import { useState } from "react";
import useAuthContext from "./useAuthContext";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const signIn = async (email, password) => {
    setIsLoading(true);
    setError(null);
    //const response = await createUser({ email, password })

    const getResponse = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASELINE_URL}users/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          }
        );
        const json = await response.json();
        if (response.ok) {
          localStorage.setItem("user", JSON.stringify(json));
          dispatch({ type: "LOGIN", payload: json });
          return response;
        }
      } catch (error) {
        setError(error.message);
      }
    };
    await getResponse();
    setIsLoading(false);
  };
  return { signIn, isLoading, error };
};
