// Return the margin according to sender
export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

// to chack if same user is sending multiple messages to display its pic at last message of sender not receiver
export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

// to chack if it is the last messages to display its pic at last message of sender not receiver
export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

// Is Same User
export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

// Return the user that is not logged in out of 2 users in a chat
export const getSender = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};
// export const getSender = (loggedUser, users) => {
//   return users[0]?._id === loggedUser._id ? users[1].name : users[0].name;
// };
// export const getSender = (loggedUser, users) => {
//   if (users && users.length > 0 && loggedUser && loggedUser._id) {
//     return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
//   } else {
//     // Handle the case when users or loggedUser is undefined or does not have _id property
//     return "Unknown sender";
//   }
// };

// getSenderFull returns the entire user not just its name
export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};
