import { 
  FormControl, FormLabel, Input, InputGroup, InputRightElement, 
  VStack, Button, useToast 
} from '@chakra-ui/react';
import { useState } from 'react';
import React from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [confirmpassword, setConfirmpassword] = useState("");
  const [pic, setPic] = useState("");
  const [load, setLoad] = useState(false);
  const [show, setShow] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const hiddenStatus = () => setShow(!show);

  const postPic = (pic) => {
    setLoad(true);
    if (pic === undefined) {
      toast({
        title: "Please upload an image",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setLoad(false);
      return;
    }

    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "ChatChat");
      data.append("cloud_name", "dwoxniu3z");

      fetch("https://api.cloudinary.com/v1_1/dwoxniu3z/image/upload", {
        method: "POST",
        body: data,
      })
        .then((resp) => resp.json())
        .then((resp) => {
          setPic(resp.url.toString());
          console.log(resp.url.toString());
          setLoad(false);
        })
        .catch((err) => {
          console.log(err);
          setLoad(false);
        });
    } else {
      toast({
        title: "Please upload an image",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setLoad(false);
      return;
    }
  };

  const submitBtn = async () => {
    setLoad(true);
    if (!name || !email || !password || !confirmpassword) {
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
    if (password !== confirmpassword) {
      toast({
        title: "Passwords do not match",
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
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "http://localhost:8000/api/user",
        { name, email, password, pic },
        config
      );

      toast({
        title: "Registration is successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoad(false);
      navigate("/chat");
    } catch (err) {
      console.error("API Error:", err); // Log the full error object

      toast({
        title: "Error Occurred",
        description:
          err.response?.data?.message || err.message || "Something went wrong",
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
        <FormLabel>Name</FormLabel>
        <Input placeholder="Enter your name" onChange={(e) => setName(e.target.value)} />
      </FormControl>

      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
      </FormControl>

      <FormControl>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h={"1.75rem"} size="sm" onClick={hiddenStatus}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />

          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={hiddenStatus}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl>
        <FormLabel>Upload your pic</FormLabel>
        <Input type="file" p={1.5} accept="image/*" onChange={(e) => postPic(e.target.files[0])} />
      </FormControl>

      <Button
        style={{ backgroundColor: "#86b2d9", marginTop: 15 }}
        width={"100%"}
        onClick={submitBtn}
        color="black"
        isLoading={load}
      >
        Signup
      </Button>
    </VStack>
  );
};

export default Signup;
