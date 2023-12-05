import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";

const ChatbotModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra UI for Modal
  const chatbotToggler = document.querySelector(".chatbot-toggler");
  const closeBtn = document.querySelector(".close-btn");
  const chatbox = document.querySelector(".chatbox");
  const chatInput = document.querySelector(".chat-input textarea");
  const sendChatBtn = document.querySelector(".chat-input span");

  let userMessage = null; // Variable to store user's message

  // const inputInitHeight = chatInput.scrollHeight;

  const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent =
      className === "outgoing"
        ? `<p></p>`
        : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
  };

  async function callRapidAPI(chatElement) {
    const messageElement = chatElement.querySelector("p");

    const url = "https://chatgpt-gpt4-ai-chatbot.p.rapidapi.com/ask";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "41bcaab171mshb93ee104e7450a2p1e54d7jsn63fd13e1ddc2",
        "X-RapidAPI-Host": "chatgpt-gpt4-ai-chatbot.p.rapidapi.com",
      },
      body: JSON.stringify({
        query: `${userMessage}`,
      }),
    };

    // messageElement.textContent = "chatResponse.response";

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      const chatResponse = JSON.parse(result);
      messageElement.textContent = chatResponse.response;
      // console.log(chatResponse.response);
    } catch (error) {
      console.error(error);
      messageElement.classList.add("error");
      messageElement.textContent =
        "Oops! Something went wrong. Please try again.";
    } finally {
      chatbox.scrollTo(0, chatbox.scrollHeight);
    }
  }
  const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if (!userMessage) return;

    //   console.log(userMessage);
    // Clear the input textarea and set its height to default
    // chatInput.value = "";
    // chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    // chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
      // Display "Thinking..." message while waiting for the response
      const incomingChatLi = createChatLi("Thinking...", "incoming");
      chatbox.appendChild(incomingChatLi);
      // chatbox.scrollTo(0, chatbox.scrollHeight);
      // generateResponse(incomingChatLi);
      callRapidAPI(incomingChatLi);
    }, 600);
    chatInput.value = null;
  };

  // chatInput.addEventListener("input", () => {
  //   // Adjust the height of the input textarea based on its content
  //   chatInput.style.height = `${inputInitHeight}px`;
  //   chatInput.style.height = `${chatInput.scrollHeight}px`;
  // });

  // chatInput.addEventListener("keydown", (e) => {
  //   // If Enter key is pressed without Shift key and the window
  //   // width is greater than 800px, handle the chat
  //   if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
  //     e.preventDefault();
  //     handleChat();
  //   }
  // });

  if (sendChatBtn !== null) {
    sendChatBtn.addEventListener("click", handleChat);
  }
  // if (sendChatBtn !== null) {
  //   sendChatBtn.addEventListener("click", function (e) {
  //     console.log("Button clicked");
  //     if (e.stopPropagation) {
  //       console.log("Stopping propagation");
  //       e.stopPropagation();
  //     }
  //     e.preventDefault(); // Prevent default action
  //     console.log("Preventing default");

  //       handleChat(); // Call the handleChat function

  //   });
  // }

  if (closeBtn !== null) {
    closeBtn.addEventListener("click", () =>
      document.body.classList.remove("show-chatbot")
    );
  }

  // if (chatbotToggler !== null) {
  // chatbotToggler.addEventListener("click", () =>
  // document.body.classList.toggle("show-chatbot")
  // );
  // }

  document.addEventListener("DOMContentLoaded", () => {
    if (chatbotToggler) {
      chatbotToggler.addEventListener("click", () => {
        document.body.classList.toggle("show-chatbot");
      });
    }
  });

  return (
    <>
      <div>
        <button class="chatbot-toggler">
          <span class="material-symbols-outlined">robot</span>
          <span class="material-symbols-outlined">close</span>
        </button>
        <div class="chatbot">
          <header>
            <h2>Chatbot</h2>
            <span class="close-btn material-symbols-outlined">close</span>
          </header>
          <ul class="chatbox">
            <li class="chat incoming">
              <span class="material-symbols-outlined">smart_toy</span>
              <p>
                Hi there 👋
                <br />
                How can I help you today?
              </p>
            </li>
          </ul>
          <div class="chat-input">
            <textarea
              placeholder="Enter a message..."
              spellcheck="false"
              required
            ></textarea>
            <span id="send-btn" class="material-symbols-rounded">
              send
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatbotModal;
