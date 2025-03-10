import {Modal, useDisclosure ,ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Image,
    Text,
    FormControl,
    Input,
    useToast,
    Spinner,
    Box} from '@chakra-ui/react'
import React, { useState } from 'react'
import { chatState } from '../../Context/ChatProvider'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'

const GroupChatModal = ({children}) => {
   const{isOpen,onClose,onOpen} =useDisclosure()
   const[groupChatName,setGroupChatName] = useState()
   const[selectedUsers, setSelectedUsers] =useState([])
   const[search,setSearch]= useState([])
   const[searchResult,setSearchResult]=useState([])
   const[load,setLoad]=useState(false)
   
   const toast= useToast()
   const{user,chats,setChats}= chatState()

   const handleSearch=async(query)=>{
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

   const handleSubmit=async()=>{
     if(!groupChatName || !selectedUsers){
      toast({
        title:"Please fill all the details",
        status:"warning",
        duration:3000,
        isClosable:true,
        position:"top"
       })
       return;
     }

     try{ 
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      };

      const {data} = await axios.post('http://localhost:8000/api/chat/group',{
        name:groupChatName,
        users:JSON.stringify(selectedUsers.map((user) => user._id))
      },config) 
      
      setChats([{ ...data, chatName: groupChatName }, ...chats])
      onClose();

      toast({
        title:"New GroupChat created",
        status:"success",
        duration:3000,
        isClosable:true,
        position:"bottom"
       })
     } catch(error){
      toast({
        title:"Failed to create chat",
        status:"error",
        duration:3000,
        isClosable:true,
        position:"bottom"
       }) 
     } 
   }

   const handleDelete=(userToDelete)=>{
     setSelectedUsers(selectedUsers.filter((sel)=>sel._id !== userToDelete._id))
   }

   const handleGroup=(userToAdd)=>{
      if(selectedUsers.includes(userToAdd)){
        toast({
          title:"User already added",
          status:"warning",
          duration:3000,
          isClosable:true,
          position:"top"
         })
         return;
      }

      setSelectedUsers([...selectedUsers,userToAdd])
   }
   return (
    <>
      <span onClick={onOpen}>{children}</span>
       <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
              <ModalOverlay />
              <ModalContent h="410px">
                <ModalHeader
                  fontSize={"35px"}
                  display={"flex"}
                  justifyContent={"center"}
                >
                 Create Group Chat
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody
                 display={"flex"}
                 flexDir={"column"}
                alignItems={"center"}
                >
                 <FormControl>
                   <Input
                    placeholder='Group Name'
                    mb={3}
                    onChange={(e) => setGroupChatName(e.target.value)}
                   />
                 </FormControl>

                 <FormControl>
                   <Input
                    placeholder='Add users'
                    mb={1}
                    onChange={(e) => handleSearch(e.target.value)}
                   />
                 </FormControl>
                 <Box w={"100%"} display={"flex"} flexWrap={"wrap"}>
                   {selectedUsers.map((user)=>(
                     <UserBadgeItem key={user._id} user={user} handleFunction={()=>handleDelete(user)}/>
                   ))}  
                 </Box> 
                
                 {load ? <Spinner ml="auto" display="flex"/> 
                  :
                   searchResult ?.slice(0,3).map((user) =>(
                    <UserListItem user={user} key={user._id} handleFunction={()=> handleGroup(user)}/>
                   ))
                  }
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme='blue' onClick={handleSubmit}>
                    Create Chat
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
    </>
  )
}

export default GroupChatModal