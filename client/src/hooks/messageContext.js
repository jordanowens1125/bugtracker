import MessageContext from "../Context/MessageContext";
import { useContext } from "react";

const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw Error("Message context must be used inside of message context provider");
    }
    
  return context;
};

export default useMessageContext;
