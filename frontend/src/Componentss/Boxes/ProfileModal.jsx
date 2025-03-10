import { IconButton, Modal, useDisclosure ,ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
  Text} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import React from 'react'
import { px } from 'framer-motion'

const ProfileModal = ({ user,children }) => {
  const { isOpen, onOpen, onClose} =useDisclosure()
  return (
    <>
      {children ? (<span onClick={onOpen}>{children}</span>)
       :
       ( <IconButton
         d={{base: "flex"}}
         icon={<ViewIcon/>}
         onClick={onOpen}
       />) 
       }
       <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
       <ModalOverlay />
       <ModalContent h="410px">
         <ModalHeader
           fontSize={"40px"}
           display={"flex"}
           justifyContent={"center"}
         >
          {user.name}
         </ModalHeader>
         <ModalCloseButton />
         <ModalBody
          display={"flex"}
          flexDir={"column"}
          justifyContent={"space-between"}
          alignItems={"center"}
         >
          <Image
            borderRadius={"full"}
            boxSize={"150px"}
            src={user.pic} 
            alt={user.name}
           />
           <Text 
            fontSize={{base: "28px", md:"30px"}}
           > 
            Email :- {user.email}
           </Text>
         </ModalBody>
         <ModalFooter>
           <Button colorScheme='blue' mr={3} onClick={onClose}>
             Close
           </Button>
         </ModalFooter>
       </ModalContent>
     </Modal>
    </>
  )
}

export default ProfileModal