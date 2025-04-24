import { 
  FormControl, FormLabel, Input, InputGroup, InputRightElement, 
  VStack, Button, useToast 
} from '@chakra-ui/react';
import { useState } from 'react';
import React from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [load, setLoad] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const hiddenStatus = () => setShow(!show);

  const submitBtn = async () => {
    setLoad(true);
  
    if (!email || !password) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setLoad(false);
      return;
    }
  
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
  
      const { data } = await axios.post(
        "http://localhost:8000/api/user/login",
        { email, password },
        config
      );
  
      console.log("Login Response:", data); 
  
      toast({
        title: "Login is successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
  
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoad(false);
      navigate("/chat");
  
    } catch (err) {
      console.error("API Error:", err.response?.data?.message || err.message); 
      toast({
        title: "Error Occurred",
        description: err.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
  
      setLoad(false);
    }
  };
  

  return (
    <VStack spacing={"5px"} color={"black"}>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder='Enter your email'
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </FormControl>
      
      <FormControl>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder='Enter password'
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <InputRightElement width={"4.5rem"}>
            <Button h={"1.75rem"} size="sm" onClick={hiddenStatus}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        style={{ backgroundColor: "#86b2d9", marginTop: 15 }}
        width={"100%"}
        onClick={submitBtn}
        color="black"
        isLoading={load}
      >
        Login
      </Button>

      <Button
        variant={"solid"}
        colorScheme='red'
        width={"100%"}
        onClick={() => {
          setEmail("guestexample.com");
          setPassword("abcdef"); 
        }}
      >
        Get Guest User Credential
      </Button>
    </VStack>
  );
};

export default Login;
