import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
// Create a Chat Context for easier state management
const ChatContext = createContext();

//Provider is a component that as it's names suggests provides the state to its children. It will hold the "store" and be the parent of all the components that might need that store.
const ChatProvider = ({ children }) => {
  // In order to make this state accesseble to other states pass it under value prop in return statement
  const [selectedChat, setSelectedChat] = useState(); // When we select a user from search
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]); // Global state for notifications
  const [chats, setChats] = useState(); // populate all of the current chats with user

  //The useHistory hook gives you access to the history instance that you may use to navigate.
  const history = useHistory();

  useEffect(() => {
    // localStorage.getItem("userInfo") stores user info in local storage in stringify format
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    // if user is not logged in redirect to login page
    if (!userInfo) history.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]); // whenever history changes it is going to run again

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// State -> Chat State
// In order to make state accesseble to other parts of the app use a hook--> useContext()
export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
