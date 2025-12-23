import { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Stack,
  Text,
  Box,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { color } from "framer-motion";
import { chatState } from '../../Context/ChatProvider'
import axios from "axios";
const TONES = [
  "Professional",
  "Polite",
  "Friendly",
  "Casual",
  "Short",
  "Expanded",
];

const pulse = keyframes
  `
  0% {
    box-shadow: 0 0 0 0 rgba(63, 177, 212, 0.7);
  }
  70% {
    box-shadow: 0 0 0 12px rgba(63, 177, 212, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(63, 177, 212, 0);
  }
`;

const ChatTone = ({ originalText, onApply }) => {
  const { user } = chatState()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [load, setLoad] = useState(false);
  const [generatedTxt, setGeneratedTxt] = useState("");

  const handleToneSelect = async (tone) => {
    setLoad(true);
    setGeneratedTxt("");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };

      const {data} = await axios.post("http://localhost:8000/api/message/tonegeneratedmsg", {
        content: originalText,
        tone: tone,
      }
    , config
    );
      // const data = await res.json();
      const newmsg = data.rewrittenText;
      setGeneratedTxt(newmsg);
      // setGeneratedTxt(data.generatedTxt);

    } catch (err) {
      console.error(err);
    }

    setLoad(false);
  };

  return (
    <>
      <Button
        size="md"
        color="black"
        backgroundColor="#e8e8e"
        animation={`${pulse} 1.2s infinite`}
        _hover={{ backgroundColor: "#3fb1d4" }}
        _active={{
          transform: "scale(0.95)",
        }}
        // border="1px solid black"
        fontWeight="bold"
        variant="outline"
        onClick={onOpen}
      >
        ✨Tone✨
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select a Message Tone</ModalHeader>
          <ModalBody>
            <Stack spacing={2}>
              {TONES.map((tone) => (
                <Button
                  key={tone}
                  onClick={() => handleToneSelect(tone)}
                  colorScheme="gray"
                  variant="outline"
                  size="sm"
                >
                  {tone}
                </Button>
              ))}
            </Stack>

            {load && (
              <Box mt={4} textAlign="center">
                <Spinner size="md" />
                <Text mt={2}>Generating ..</Text>
              </Box>
            )}

            {generatedTxt && (
              <Box
                mt={4}
                p={3}
                bg="gray.100"
                borderRadius="md"
                border="1px solid #ddd"
              >
                <Text fontSize="sm">{generatedTxt}</Text>
                <Button
                  mt={3}
                  colorScheme="blue"
                  width="100%"
                  onClick={() => {
                    onApply(generatedTxt); // send rewritten msg back
                    onClose();
                  }}
                >
                  Use This Message
                </Button>
              </Box>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ChatTone;
