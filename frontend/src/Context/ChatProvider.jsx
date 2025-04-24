import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();  

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const[selectedChat,setSelectedChat] =useState(null);
    const[chats,setChats]=useState([])
    const navigate = useNavigate();
    const[notification,setNotification] = useState([])
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);

        if (!userInfo) {
            navigate("/");
        }
    }, [navigate]);

    return (
        <ChatContext.Provider value={{ user, setUser,selectedChat,setSelectedChat,chats,setChats,notification,setNotification}}>
            {children}
        </ChatContext.Provider>
    );
};

// Function to access ChatContext
export const chatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;
