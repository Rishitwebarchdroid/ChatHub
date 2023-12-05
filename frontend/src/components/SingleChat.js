import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import Emoji from "../asset/emoji.svg";
import "./styles.css";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon, AddIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";

import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import { Image } from "@chakra-ui/react";
import Robot from "../asset/robot.gif";
import { PlusSquareIcon } from "@chakra-ui/icons";
import Picker from "emoji-picker-react";
import { black } from "colors";

// Socket.io

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false); // Connection status of a socket
  const [showEmojiPicker, setshowEmojiPicker] = useState(false); // For Emoji Picker
  const [pic, setPic] = useState();
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();

  // Lottie Animations
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  // Fetching all the chats
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      // User can Join the room
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  // Send The Message On Enter Key
  const sendMessage = async (event) => {
    // Stop Typing after enter key
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        // JWT Auth
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );

        // send message from socket
        socket.emit("new message", data);
        setMessages([...messages, data]); // append latest message at last of message array
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  // Start Socket.io
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  // Call Fetch Chat Method to fetch all chats whenever selectedChat changes
  useEffect(() => {
    fetchMessages();

    // To keep backup of selectedChat to compare it and decide to emit the message or send notification
    selectedChatCompare = selectedChat;

    // eslint-disable-next-line
  }, [selectedChat]);

  // UseEffect with no dependency because we want to update this effect every time our state changes

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // Give Notification
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  // Show receiver that sender is typing (Typing Indicator)
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    // Stop Typing after 3 sec user is not typing
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  // Emoji Picker
  const handelEmojiPickerShow = () => {
    setshowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emoji) => {
    const message = newMessage + event.emoji;
    setNewMessage(message);
  };

  // handel image upload
  // const handelImage = async (e) => {
  //   const file = e.target.files[0];
  //   let formData = new formData();
  //   formData.append("image", file);
  //   console.log([...formData]);
  // };

  // to uplod pic to cloud
  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-hub");
      data.append("cloud_name", "dyjnlh1ef");
      fetch("https://api.cloudinary.com/v1_1/dyjnlh1ef/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          /////////////////
          const message = newMessage + data.url.toString();
          setNewMessage(message);
          ////////////////////
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };
  return (
    <>
      {/* If a chat is selected then show the chat else show  Click on a user to start chatting  */}
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            {/* Arrow button to go back to MyChats is small screen */}
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {/* If Group Chat is Selected show name of Group & update group info button */}
            {/* If Individual Chat is Selected show name of person & show profile option  */}
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {/*Return the user that is not logged in out of 2 users in a chat */}
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    // getSenderFull returns the entire user not just its name
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  {/* Update Group Chat Info */}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages} // To call it after removing someone from group
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#f8f9fd"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {/* If Messages are loading show spinner else render all messages */}
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            {/* Input to enter new message */}
            <FormControl
              display="flex" /////////////////////////
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {/* Typing Animation */}
              {/* Lottie Animation */}
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}

              <div className="emoji">
                <Image
                  height="2rem"
                  src={Emoji}
                  alt="Logo"
                  onClick={handelEmojiPickerShow}
                />
                {/* <PlusSquareIcon onClick={handelEmojiPickerShow} /> */}
                {showEmojiPicker && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-400px",
                      left: "0",
                      zIndex: "999",
                      backgroundColor: "#fff",
                      boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
                      borderRadius: "4px",
                      padding: "8px",
                      width: "25rem", // Adjust the width as needed
                      maxHeight: "25rem", // Adjust the max height as needed
                      overflow: "auto", // Add scroll if needed
                    }}
                  >
                    <Picker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
              </div>
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
              <Box display={"flex"} justifyContent={"space-between"}>
                <label>
                  <AddIcon />
                  <input
                    // size="sm"
                    type="file"
                    accept="images/*"
                    onChange={(e) => postDetails(e.target.files[0])}
                    hidden
                    // icon={<AddIcon />}
                  />
                </label>
              </Box>
              {/* <FormControl id="pic">
                <FormLabel>Profile Picture</FormLabel>
                <Input
                  type="file"
                  
                  accept="image/*"
                  
                  onChange={(e) => postDetails(e.target.files[0])}
                  hidden
                />
                <IconButton icon={<AddIcon />} />
              </FormControl> */}
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3}>
            <Image height="20rem" src={Robot} alt="Logo" />
            <Text
              display="flex"
              justifyContent="center"
              alignItems="center"
              color="#4e00ff"
            >
              {user.name}!
            </Text>
            <Text>Click on a user to start chatting</Text>
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
