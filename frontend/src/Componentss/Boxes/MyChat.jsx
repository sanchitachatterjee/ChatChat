import React, { useEffect, useState } from 'react'
import { chatState } from '../../Context/ChatProvider'
import { useToast,Box, Button, Stack, Text } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from '../ChatLoading';
import { getSender } from '../../Config/ChatLogic';
import GroupChatModal from './GroupChatModal';

const MyChat = ({fetchAgain}) => {
  const {selectedChat,setSelectedChat,user, chats,setChats} =chatState()
  const[loggedUser,setLoggedUser]=useState();
  const toast=useToast();

  const fetchChats= async() =>{
    try{
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      };

      const {data} =await axios.get('http://localhost:8000/api/chat',config)
      console.log(data);
      setChats(data)
    } catch(error){
      toast({
              title:"Error failed to load chats",
              status:"error",
              duration:3000,
              isClosable:true,
              position:"bottom-left",
             })
    }
  }

  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
    fetchChats()
  },[fetchAgain])
  return (
    <Box
     display={{base : selectedChat ? "none" : "flex",md:"flex"}}
     flexDir={"column"}
     alignItems={"center"}
     p={3}
     bg={"white"}
     w={{base:"100%" ,md:"31%"}}  
     borderRadius={"lg"}
     borderWidth={"1px"}  
    >
      <Box
        pb={3}
        px={3}
        fontSize={{base:"28px" , md:"30px"}}
        display={"flex"}
        width={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >

       Chats
       <GroupChatModal>
         <Button
          display={"flex"}
          fontSize={{base:"17px" ,md:"10px", lg:"17px"}}
          rightIcon={<AddIcon/>}
         >
          New Group Chat
        </Button> 
      </GroupChatModal>
       
      </Box>

      <Box
        display={"flex"}
        flexDir={"column"}
        p={3}
        bg={"f8f8f8"}
        width={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {chats ? (
           <Stack overflowY={"scroll"}>
            {chats.map((chat) =>(
              <Box 
                onClick={()=>setSelectedChat(chat)}
                cursor={"pointer"}
                bg={selectedChat === chat ?  "#3fb1d4" : "e8e8e8"}
                color={selectedChat === chat ?  "white":"black"}
                px={3}
                pb={2}
                borderRadius={"lg"}
                key={chat._id}  
              >
               <Text>
                {chat.isGroupChat ? (
                   (chat.chatName) 
                 ) :
                 getSender(loggedUser,chat.users)
               }
               </Text>
              </Box>
            ))}
           </Stack>
        ) :(
         <ChatLoading/>
        ) 
      }
      </Box>
    </Box>
  )
}

export default MyChat