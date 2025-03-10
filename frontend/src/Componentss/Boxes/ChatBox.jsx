import React from 'react'
import { chatState } from '../../Context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SingleChat from '../SingleChat'

const ChatBox = ({fetchAgain, setFetchAgain}) => {
  const {selectedChat} = chatState()
  return (
    <Box
     display={{base: selectedChat ? "flex" :"none", md:"flex"}}
     alignItems={"center"}
     flexDir={"column"}
     bg={"white"}
     width={{base : "100%" , md:"68%"}}
     borderRadius={"lg"}
     borderWidth={"1px"}
     height={"90vh"}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  )
}

export default ChatBox
