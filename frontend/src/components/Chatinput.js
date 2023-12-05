// import React from "react";
// import { useEffect, useState } from "react";
// import Picker from "emoji-picker-react";
// import { PlusSquareIcon } from "@chakra-ui/icons";
// import { Container } from "@chakra-ui/react";
// export default function Chatinput() {
//   const [showEmojiPicker, setshowEmojiPicker] = useState(false);
//   const [msg, setmsg] = useState("");

//   const handelEmojiPickerShow = () => {
//     setshowEmojiPicker(!showEmojiPicker);
//   };

//   const handleEmojiClick = (event, emoji) => {
//     let message = msg;
//     message += emoji.emoji;
//     setmsg(message);
//   };

//   return (
//     <div className="emoji">
//       <PlusSquareIcon onClick={handelEmojiPickerShow} />
//       {showEmojiPicker && (
//         <div
//           style={{
//             position: "absolute",
//             top: "-400px",
//             left: "0",
//             zIndex: "999",
//             backgroundColor: "#fff",
//             boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
//             borderRadius: "4px",
//             padding: "8px",
//             width: "25rem", // Adjust the width as needed
//             maxHeight: "25rem", // Adjust the max height as needed
//             overflow: "auto", // Add scroll if needed
//           }}
//         >
//           <Picker onEmojiClick={handleEmojiClick} />
//         </div>
//       )}
//     </div>
//   );
// }
