import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../utils/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser,
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider,
  updateEmail,
  fetchSignInMethodsForEmail,
} from "firebase/auth";


const userAuthContext = createContext();
export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState("");
  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function logOut() {
    return signOut(auth);
  }
  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  }
  function removeUser() {
    deleteUser(user)
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  }
  async function reauthenticateUser(userInfo) {
    const credentials = EmailAuthProvider.credential(
      userInfo.email,
      userInfo.password
    );
    const response = await reauthenticateWithCredential(
      auth.currentUser,
      credentials
    )
      .then(() => {
        return true;
      })
      .catch((error) => {
        return error;
      });
    return response;
  }
  async function updateUserEmail(email) {
    const result = updateEmail(auth.currentUser, email)
      .then(() => {
        // Email updated!
        // ...
        return [
          true,
          "Email was successfully updated! Being redirected to signin page.",
        ];
      })
      .catch((error) => {
        // An error occurred
        // ...
        return [false, error.message];
      });
    return result;
  }
  async function updateUserPassword(password) {
    const result = updatePassword(auth.currentUser, password)
      .then(() => {
        // Email updated!
        // ...
        return [true, "Password was successfully updated!"];
      })
      .catch((error) => {
        // An error occurred
        // ...
        return [false, error.message];
      });
    return result;
  }
  async function getSignInMethods() {
    const result = await fetchSignInMethodsForEmail(
      auth,
      auth.currentUser.email
    )
      .then((result) => {
        return result;
      })
      .catch((error) => {
        return error.message;
      });
    return result;
  }
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <userAuthContext.Provider
      value={{
        user,
        googleSignIn,
        signUp,
        updateUserEmail,
        updateUserPassword,
        getSignInMethods,
        logIn,
        logOut,
        removeUser,
        reauthenticateUser,
      }}
    >
      {children}
    </userAuthContext.Provider>
  );
}
export const useUserAuth = () => {
  return useContext(userAuthContext);
};
