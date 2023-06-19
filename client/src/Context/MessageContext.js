import { createContext, useReducer } from "react";

const MessageContext = createContext({});

export const messageReducer = (state, action) => {
  switch (action.type) {
    case "SHOW":
      return { message: action.payload, display:true };
    case "CLEAR":
      return { message: '', display: false };
    default:
      return state;
  }
};

export const MessageContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messageReducer, {
      message: '',
      display:false,
  });

  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem("user"));
  //   if (user) {
  //     dispatch({ type: "LOGIN", payload: user });
  //   }
  // }, []);

  // console.log("Message Context state", state);

  return (
    <MessageContext.Provider value={{ ...state, dispatch }}>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageContext;
