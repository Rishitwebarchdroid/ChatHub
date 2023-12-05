import {
  Box,
  Container,
  Hide,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { Image } from "@chakra-ui/react";
import Logo from "../asset/logo.svg";
import ChatHUB from "../asset/chathub.png";
import Fox from "../asset/fox2.gif";
import { black } from "colors";

function Homepage() {
  //The useHistory hook gives you access to the history instance that you may use to navigate.
  const history = useHistory();
  useEffect(() => {
    // localStorage.getItem("userInfo") stores user info in local storage in stringify format
    const user = JSON.parse(localStorage.getItem("userInfo"));

    // if user is not logged in redirect to login page
    if (user) history.push("/chats");
  }, [history]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        zIndex={2}
      >
        <Text display="flex" fontSize="4xl" fontFamily="Work sans">
          <Image
            height="4rem"
            src={ChatHUB}
            alt="Logo"
            justifyContent={"center"}
          />
          {/* Chat HUB */}
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      <Image
        left={6}
        borderRadius={"full"}
        background={"white"}
        width={80}
        top={40}
        // display={"flex"}
        display={{ base: "none", xl: "block" }}
        position={"fixed"}
        overflow={"hidden"}
        zIndex={1}
        // position={{ base: "fixed", md: "relative" }}
        src={Fox}
      />

      {/* <Text>Hello</Text> */}
    </Container>
  );
}

export default Homepage;
