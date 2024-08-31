import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate for React Router v6

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(); // Initialize user state as null
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);

  const navigate = useNavigate(); // Use useNavigate for React Router v6

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) {
      setUser(userInfo);
    } else {
      navigate("/"); // Use navigate to redirect in React Router v6
    }
  }, [navigate]); // Include navigate in dependency array

  return (
    <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification }}>
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
