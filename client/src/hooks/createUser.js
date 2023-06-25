import { useState } from "react";
import useAuthContext from "./useAuthContext";

export const useCreateUser = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();
  const signup = async (email, password, role, name) => {
    setIsLoading(true);
    setError(null);
    const response = await fetch(
      `${process.env.REACT_APP_BASELINE_URL}users/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ email, password, role, name }),
      }
    );
    const json = await response.json();
    if (!response.ok) {
      setIsLoading(false);
      setError(json.message);
    } else {
      setIsLoading(false);
    }
    return { response, user: json };
  };
  return { signup, isLoading, error };
};
