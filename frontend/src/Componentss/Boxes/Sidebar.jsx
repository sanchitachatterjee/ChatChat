import {
  Box, Button, Text, Tooltip, Menu, MenuButton, MenuList, MenuItem, IconButton,
  Avatar,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner,
  Badge
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"; // Corrected import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { chatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../Config/ChatLogic";


const Sidebar = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [load, setLoad] = useState(false);
  const [loadChat, setLoadChat] = useState();
  const navigate = useNavigate()
  const { user, setSelectedChat, chats, setChats, notification, setNotification } = chatState()
  const MotionText = motion(Text);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const logOutHandler = () => {
    localStorage.removeItem("userInfo")
    navigate("/")
  }


  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter a name or email",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoad(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.get(`http://localhost:8000/api/user?search=${search}`, config);

      setLoad(false);
      setSearchResult(data);
    } catch (error) {
      console.error("Error fetching users:", error);

      toast({
        title: "Failed to load search result",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };


  const accessChat = async (userId) => {
    try {
      setLoadChat(true)
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        }
      };

      const { data } = await axios.post('http://localhost:8000/api/chat', { userId }, config)

      if (!chats.find((e) => e._id === data._id)) {
        setChats([data, ...chats])
      }

      setSelectedChat(data);
      setLoadChat(false)
      onClose()
    } catch (error) {
      toast({
        title: "Error fetching the data",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      })
    }
  }

  const NotificationIcon = ({ count }) => {
    return (
      <Box position="relative">
        <IconButton icon={<BellIcon fontSize="2xl" />} variant="ghost" />
        {count > 0 && (
          <Badge
            position="absolute"
            top="0"
            right="0"
            bg="red.500"
            color="white"
            borderRadius="full"
            fontSize="0.8em"
            p="0.3em"
            w="20px"
            h="20px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {count}
          </Badge>
        )}
      </Box>
    );
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search user to Chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={() => onOpen()}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search user
            </Text>
          </Button>
        </Tooltip>

        <MotionText
          fontSize={{ base: "3xl", md: "5xl" }}
          textAlign="center"
          fontWeight="bold"
          bgGradient="linear(to-r, teal.400, blue.500, blue.600)"
          bgClip="text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          ChatChat
        </MotionText>

        <div>
          <Menu>
            <MenuButton as={Button} variant="ghost" p={1}>
              <Box position="relative">
                <BellIcon fontSize="2xl" m={1} />
                {notification.length > 0 && (
                  <Badge
                    position="absolute"
                    top="-2px"
                    right="-2px"
                    bg="red.500"
                    color="white"
                    borderRadius="full"
                    fontSize="0.8em"
                    p="0.3em"
                    w="20px"
                    h="20px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {notification.length}
                  </Badge>
                )}
              </Box>
            </MenuButton>

            {/* notification ui */}
            <MenuList pl={2} height={"50px"}>
              {!notification.length && "No new messages"}
              {notification.map((n) => (
                <MenuItem key={n._id} onClick={() => {
                  setSelectedChat(n.chat);
                  setNotification(notification.filter((notif) => notif !== n));
                }}>
                  {n.chat.isGroupChat ? `New message in ${n.chat.chatName}`
                    : `New Message from ${getSender(user, n.chat.users)}`}
                </MenuItem>
              ))}

            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size='sm' cursor={"pointer"} name={user.name} src={user.pic} />
            </MenuButton>

            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>

              <MenuItem onClick={logOutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>


      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => { setSearch(e.target.value) }}
              />
              <Button onClick={handleSearch}>Enter</Button>
            </Box>

            {load ?
              (<ChatLoading />)
              :
              (searchResult?.map((user) => (
                <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
              )))
            }

            {loadChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

    </>
  );
};

export default Sidebar;
