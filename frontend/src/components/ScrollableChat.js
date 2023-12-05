import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed"; // NPM package for Scrollable feed
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import { Button } from "@chakra-ui/react";
import { CopyIcon, ExternalLinkIcon } from "@chakra-ui/icons";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  function wordFoundInString(inputString, targetWord) {
    const lowerCaseInput = inputString.toLowerCase();
    const lowerCaseWord = targetWord.toLowerCase();

    return lowerCaseInput.includes(lowerCaseWord);
  }
  function wordNotFoundInString(inputString, targetWord) {
    const lowerCaseInput = inputString.toLowerCase();
    const lowerCaseWord = targetWord.toLowerCase();

    return !lowerCaseInput.includes(lowerCaseWord);
  }
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {/* While Mapping pass a key value */}
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}

            {/* render messages */}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#7c93f6" : "#f8f9fd"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                border: "1px solid ",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {wordNotFoundInString(m.content, "http://res.cloudinary.com")
                ? m.content
                : "Photo"}
              {/* {console.log(m)} */}
              {wordNotFoundInString(m.content, "http://res.cloudinary.com") && (
                <Button
                  size="md"
                  colorScheme=""
                  key={m._id}
                  onClick={(e) => {
                    e.preventDefault();

                    navigator.clipboard.writeText(m.content);
                  }}
                >
                  <CopyIcon w={4} h={4} color="black" size={"xl"} />
                </Button>
              )}

              {wordFoundInString(m.content, "http://res.cloudinary.com") && (
                <Button
                  size="md"
                  colorScheme=""
                  key={m._id}
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(`${m.content}`, "_blank");
                  }}
                >
                  <ExternalLinkIcon color="black" />
                </Button>
              )}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
