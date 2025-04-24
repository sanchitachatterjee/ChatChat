
import React, { useEffect, useRef } from "react";
import { chatState } from "../Context/ChatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";
import "./ChatMessages.css";

const ChatMessages = ({ messages }) => {
  const { user } = chatState();
  const messagesEndRef = useRef(null);

  if (!user || !user._id) return null;


  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div 
      ref={messagesEndRef}
      style={{ 
        height: "calc(100vh - 150px)", 
        overflowY: "auto", 
        padding: "10px",
        overflowAnchor: "auto", // ✅ Prevents layout shift
      }}
    >
      {messages.map((m, index) => {
        const isUserMessage = m.sender._id === user._id;

        return (
          <div
            key={m._id}
            style={{
              display: "flex",
              justifyContent: isUserMessage ? "flex-end" : "flex-start",
              marginBottom: "5px",
            }}
          >
    
            {!isUserMessage && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar mt="7px" mr={1} size="sm" cursor="pointer" name={m.sender.name} src={m.sender.pic} />
              </Tooltip>
            )}

            <span
              style={{
                backgroundColor: isUserMessage ? "#bee3f8" : "#b9f5d0",
                borderRadius: "20px",
                padding: "10px 15px",
                maxWidth: "60%",
                alignSelf: "center",
              }}
            >
              {m.content}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessages;


