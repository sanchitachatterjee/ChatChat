import React, { useState } from 'react'
import { ViewIcon } from '@chakra-ui/icons'
import { IconButton, Modal, useDisclosure ,ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Image,
    Text,
    useToast,
    Box,
    FormControl,
    Input,
    Spinner} from '@chakra-ui/react'
import { chatState } from '../../Context/ChatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'


const UpdateGroupChatModal = ({fetchAgain,setFetchAgain, fetchMessages}) => {
  const { isOpen, onOpen, onClose} =useDisclosure()
  const {selectedChat, setSelectedChat,user} =chatState()
  const [groupChatName, setGroupChatName] =useState("")
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] =useState([])
  const [load, setLoad] =useState(false) 
  const [renameLoad, setRenameLoad] =useState(false)
  
  const toast = useToast()
  const handleRename =async()=>{
    if(!groupChatName){
        return;
    }

    try{
        setRenameLoad(true)
        const config={
            headers:{
                Authorization:`Bearer ${user.token}`
            }
        };

        const {data} = await axios.put("http://localhost:8000/api/chat/rename",{
            chatId:selectedChat._id,
            chatName:groupChatName,    
        }, config)

        setSelectedChat(data)
        setFetchAgain(!fetchAgain)
        setRenameLoad(false)
    } catch(error){
        toast({
            title:"Error occured",
            description:error.response.data.message,
            status:"error",
            duration:3000,
            isClosable:true,
            position:"bottom"
        })
        setRenameLoad(false)
    }
    setGroupChatName("")
  }
  const handleSearch = async(query)=>{
    setSearch(query)
       if(!query){
        return;
       }

       try{
        setLoad(true);
        const config={
          headers:{
            Authorization:`Bearer ${user.token}`
          }
        };

        const {data} =await axios.get(`http://localhost:8000/api/user?search=${search}`,config)
        console.log(data) 
        setLoad(false)
        setSearchResult(data);
       } catch(error){
         toast({
          title:"Failed to load the search Results",
          status:"warning",
          duration:3000,
          isClosable:true,
          position:"bottom-left"
         })
       }
  }

  const handleAddUser=async(u)=>{
    if(selectedChat.user.find((user)=> user._id === u._id)){
        toast({
            title:"User already in the group",
            status:"error",
            duration:3000,
            isClosable:true,
            position:"bottom"
           })
           return;
    }

    if(selectedChat.groupAdmin._id !== user._id){
        toast({
            title:"Only admins can add users",
            status:"error",
            duration:3000,
            isClosable:true,
            position:"bottom"
           })
           return;
    }

    try{
      setLoad(true)
      const config={
        headers:{
            Authorization:`Bearer ${user.token}`
        }
      };

      const {data} =await axios.put("http://localhost:8000/api/chat/groupadd",{
        chatId:selectedChat._id,
        userId: u._id
      },config)

      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setLoad(false)
    } catch(error){
        toast({
            title:"Failed to load the search Results",
            status:"warning",
            duration:3000,
            isClosable:true,
            position:"bottom-left"
           })

           setLoad(false)
    }
  }

  const handleRemove =async(u)=>{
    if(selectedChat.groupAdmin._id !== user._id && u._id !== user._id){
        toast({
            title:"Only admins can remove user ",
            status:"error",
            duration:3000,
            isClosable:true,
            position:"bottom"
           })
           return;
    }
    try{
      setLoad(true)
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      };
      const {data} =await axios.put("http://localhost:8000/api/chat/groupremove",{
        chatId:selectedChat._id,
        userId: u._id
      },config)
      
      u._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain)
      fetchMessages(); //to make sure all the messages got refreshed
      setLoad(false)

    } catch(error){
        toast({
            title:"Error occured",
            // description:error.response.data.message,
            status:"error",
            duration:3000,
            isClosable:true,
            position:"bottom"
        })
    }
  }
  return (
      <>
          <IconButton
           d={{base: "flex"}}
           icon={<ViewIcon/>}
           onClick={onOpen}
         />

         <Modal isOpen={isOpen} onClose={onClose} isCentered>
         <ModalOverlay />
         <ModalContent h="410px">
           <ModalHeader
             fontSize={"35px"}
             display={"flex"}
             justifyContent={"center"}
           >
            {selectedChat.chatName}
           </ModalHeader>
           <ModalCloseButton />
           <ModalBody
            display={"flex"}
            flexDir={"column"}
            justifyContent={"space-between"}
            alignItems={"center"}
           >
            <Box width={"100%"} display={"flex"} flexWrap={"wrap"} pb={3}>
                {selectedChat.users.map((user)=>(
                 <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={()=> handleRemove(user)}
                 />
                ))}
            </Box>

            <FormControl display={"flex"}>
               <Input
                 placeholder='Group name'
                 mb={3}
                 value={groupChatName}
                 onChange={(e) => setGroupChatName(e.target.value)}
               />
               <Button
                bg="#3da9e3"
                ml={1}
                isLoading={renameLoad}
                onClick={handleRename}
               >
                 Change
               </Button>
            </FormControl>

            <FormControl>
                <Input
                 placeholder='Add users to group'
                 mb={1}
                 onChange={(e) => handleSearch(e.target.value)}
                />

            </FormControl>
            {load ? (
             <Spinner size={"lg"}/>
            ) :
            (
             searchResult?.map((user) =>(
              <UserListItem
               key={user._id}
               user={user}
               handleFunction={() =>handleAddUser(user)} 
              />
             ))
            )
           }

           </ModalBody>
           <ModalFooter>
             <Button colorScheme='red' mr={3} onClick={()=>handleRemove(user)}>
               Leave Group
             </Button>
           </ModalFooter>
         </ModalContent>
       </Modal>
      </>
    )
  }

export default UpdateGroupChatModal