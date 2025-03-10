import React, { useEffect, useState, useRef } from 'react';
import { chatState } from '../Context/ChatProvider';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../Config/ChatLogic';
import ProfileModal from './Boxes/ProfileModal';
import UpdateGroupChatModal from './Boxes/UpdateGroupChatModal';
import axios from 'axios';
import ChatMessages from './ChatMessages';
import io from 'socket.io-client';

const EndPoint = "http://localhost:8000";
var socket, typingTimeout;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [load, setLoad] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const { user, selectedChat, setSelectedChat, notification, setNotification } = chatState();
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    
    const toast = useToast();
    const selectedChatRef = useRef(selectedChat);
    const lastMessageRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        socket = io(EndPoint);
        socket.emit("setup", user);
        socket.on("connect", () => setSocketConnected(true));

        socket.on("Typing", () => setIsTyping(true));
        socket.on("Stop Typing", () => setIsTyping(false));

        return () => {
            socket.disconnect();
        };
    }, [user]);

    const sendMessage = async (e) => {
        if (e.key === "Enter" && newMessage.trim() !== "") {
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                };

                const { data } = await axios.post(`${EndPoint}/api/message`, {
                    content: newMessage,
                    chatId: selectedChat?._id,
                }, config);

                setNewMessage("");
                socket.emit("New Message", data);
                setMessages((prevMessages) => [...prevMessages, data]);
            } catch (error) {
                toast({
                    title: "Error sending message",
                    description: error.response?.data?.message || "Something went wrong",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "bottom-left",
                });
            }
        }
    };

    const fetchMessages = async () => {
        if (!selectedChat?._id) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };

            setLoad(true);
            const { data } = await axios.get(`${EndPoint}/api/message/${selectedChat._id}`, config);
            
            setMessages(data);
            setLoad(false);

            socket.emit("Join chat", selectedChat._id);
        } catch (error) {
            toast({
                title: "Error loading messages",
                description: error.response?.data?.message || "Something went wrong",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom-left",
            });
            setLoad(false);
        }
    };

    useEffect(() => {
        selectedChatRef.current = selectedChat;
        if (selectedChat) fetchMessages();
    }, [selectedChat]);

    useEffect(() => {
        socket.on("Message recieved", (newMsg) => {
            if (!selectedChatRef.current || selectedChatRef.current._id !== newMsg.chat._id) {
                if (!notification.includes(newMsg)) {
                    setNotification([newMsg, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages((prevMessages) => [...prevMessages, newMsg]);
            }
        });

        return () => {
            socket.off("Message recieved");
        };
    }, []);

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const typingHandler = (e) => {
      setNewMessage(e.target.value);
      if (!socketConnected) return;

      if (!typing) {
          setTyping(true);
          socket.emit("Typing", selectedChat._id);
      }

      // Clear the previous timeout
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
          socket.emit("Stop Typing", selectedChat._id);
          setTyping(false);
      }, 2000);
    };

    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        width={"100%"}
                        display={"flex"}
                        justifyContent={{ base: "space-between" }}
                        alignItems={"center"}
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {!selectedChat.isGroupChat ? (
                            <> 
                                {getSender(user, selectedChat.users)}
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>  
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages}
                                /> 
                            </>
                        )}
                    </Text>

                    <Box
                        display={"flex"}
                        flexDir={"column"}
                        justifyContent={"flex-end"}
                        p={5}
                        bg="#e8e8e8"
                        width={"97%"}
                        height={"85%"}
                        borderRadius={"lg"}
                        overflowY={"hidden"}
                    >
                        {load ? (
                            <Spinner size={"xl"} width={20} height={20} alignSelf={"center"} margin={"auto"} />
                        ) : (
                            <div style={{ display: 'flex', flexDirection: "column", overflowY: "scroll", scrollbarWidth: "none" }}>
                                <ChatMessages messages={messages} />
                                {isTyping && (
                                 <Text fontSize="sm" color="gray.500">
                                   Typing...
                                 </Text>)} 
                            </div>
                        )}

                        <FormControl mt={3} onKeyDown={sendMessage} isRequired>
                            <Input
                                bg={"#e0e0e0"}
                                placeholder='Type message...'
                                onChange={typingHandler}
                                value={newMessage}
                            />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                    <Text fontSize={"3xl"} pb={3}>
                        Click on a user to start the chat
                    </Text>
                </Box>
            )}
        </>
    );
};

export default SingleChat;
