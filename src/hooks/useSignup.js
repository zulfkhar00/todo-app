import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, firstName, lastName) => {
    setIsLoading(true);
    setError(null);

    console.log(
      `Body: ${JSON.stringify({ email, password, firstName, lastName })}`
    );

    const response = await fetch(`http://localhost:8000/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
      return false;
    } else {
      // save the user to local storage
      localStorage.setItem("user", JSON.stringify(json["user"]));
      console.log(`After signup received: ${json}`);

      // update the Auth context
      dispatch({ type: "LOGIN", payload: json });
      setIsLoading(false);
      return true;
    }
  };

  return { signup, isLoading, error };
};
