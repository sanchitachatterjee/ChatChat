import { Container, Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Login from '../Componentss/Authentication/Login'
import Signup from '../Componentss/Authentication/Signup'
import { useNavigate } from 'react-router-dom'
import { motion } from "framer-motion";
const HomePage = () => {
  const navigate=useNavigate();
  useEffect(()=>{
     const user= JSON.parse(localStorage.getItem("userInfo"));
     if(user){
       navigate('/chat')
     }

  },[navigate])

  const MotionText = motion(Text);
  return (
    <Container maxW='xl' centerContent>
      <Box
        d='flex'
        justifyContent='center'
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="10px"
        borderWidth="1px"
        textAlign={"center"}
    
      >
        {/* <Text fontSize={"4xl"} fontFamily={"Work sans"} color={"black"}>
          ChatChat
        </Text> */}

     <MotionText
        fontSize={{ base: "3xl", md: "5xl" }}
        fontWeight="bold"
        bgGradient="linear(to-r, teal.400, blue.500, purple.600)"
        bgClip="text"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        ChatChat
      </MotionText>
      </Box>

      <Box
        bg={"white"}
        w={"100%"}
        p={4}
        borderRadius={"lg"}
        borderWidth={"1px"}
        color={"black"}
      >
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab> Signup </Tab>
            <Tab> Login </Tab>
          </TabList>
          <TabPanels>

            <TabPanel>
              <Signup />
            </TabPanel>

            <TabPanel>
              <Login />
            </TabPanel>

          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage