import React, { useState } from 'react'
import { chatState } from '../Context/ChatProvider'
import { Box } from '@chakra-ui/react'
import Sidebar from '../Componentss/Boxes/Sidebar'
import MyChat from '../Componentss/Boxes/MyChat'
import ChatBox from '../Componentss/Boxes/ChatBox'

const ChatPage = () => {
  const { user } = chatState()
  const [fetchAgain, setFetchAgain]=useState()
  return (
    <div
    style={{width:'100%', overflow:"hidden",height:"99.2vh"}}
    >
     {user && <Sidebar/>} 
    <Box
    display="flex"
    justifyContent={"space-between"}
    w='100%'
    h='91.5vh'
    p="10px"
    >
      {user && <MyChat fetchAgain={fetchAgain} />}
      {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
    </Box>
    </div>
  )
}

export default ChatPage