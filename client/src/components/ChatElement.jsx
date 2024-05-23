// import {
//   Stack,
//   Avatar,
//   Badge,
//   Box,
//   Typography,
//   styled,
//   useTheme,
//   alpha,
// } from "@mui/material";
// import { useSocketContext } from "SocketContext";
// import { useDispatch, useSelector } from "react-redux";
// import StyledBadge from "./StyledBadge";
// import { SetCurrentConversation } from "Redux/Slice/conversation";

// const StyledChatBox = styled(Box)(({ theme }) => ({
//   "&:hover": {
//     cursor: "pointer",
//   },
// }));

// export const ChatElement = ({
//   img,
//   name,
//   // msg,
//   // time,
//   // unread,
//   // online,
//   _id,
//   msg,
//   time,
//   unread,
//   // picturePath,
//   // firstName,
//   // lastName,
//   ...other
// }) => {
//   const theme = useTheme();
//   // const name = `${firstName} ${lastName}`;
//   const onlineUsers = useSelector((state) => state.app.onlineUsers);
//   const online = onlineUsers.includes(_id);

//   const dispatch = useDispatch();
//   // console.log(other);
//   const conversation = { _id, img, name, msg, ...other };
//   // console.log(conversation);

//   // const selectedConversation = useSelector(
//   //   (state) => state.conversation.selectedConversation
//   // );
//   const selectedConversation = useSelector(
//     (state) => state.conversation.direct_chat.current_conversation
//   );
//   const isSelected = selectedConversation?._id === _id;
//   // console.log(selectedConversation);

//   return (
//     <StyledChatBox
//       onClick={() => {
//         dispatch(
//           SetCurrentConversation({ selectedConversation: conversation })
//         );
//       }}
//       sx={{
//         width: "100%",

//         borderRadius: 1,

//         backgroundColor: isSelected
//           ? theme.palette.primary.main
//           : theme.palette.background.alt,
//       }}
//       p={2}
//     >
//       <Stack
//         direction={"row"}
//         justifyContent={"space-between"}
//         alignItems={"center"}
//       >
//         <Stack direction={"row"} spacing={2}>
//           {online ? (
//             <StyledBadge
//               overlap="circular"
//               anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//               variant="dot"
//             >
//               <Avatar src={img} />
//             </StyledBadge>
//           ) : (
//             <Avatar src={img} />
//           )}
//           <Stack spacing={0.3}>
//             <Typography
//               variant="subtitle2"
//               // color={isSelected ? "black" : "white"}
//             >
//               {name}
//             </Typography>
//             <Typography variant="caption">{msg}</Typography>
//           </Stack>
//         </Stack>
//         <Stack spacing={2} alignItems={"center"}>
//           <Typography sx={{ fontWeight: 500 }} variant="caption">
//             {time}
//           </Typography>
//           <Badge color="primary" badgeContent={unread}></Badge>
//         </Stack>
//       </Stack>
//     </StyledChatBox>
//   );
// };

import {
  Stack,
  Avatar,
  Badge,
  Box,
  Typography,
  styled,
  useTheme,
  alpha,
} from "@mui/material";
import { useSocketContext } from "SocketContext";
import { useDispatch, useSelector } from "react-redux";
import StyledBadge from "./StyledBadge";
import { SetCurrentConversation } from "Redux/Slice/conversation";
import { useEffect, useState } from "react";

const StyledChatBox = styled(Box)(({ theme }) => ({
  "&:hover": {
    cursor: "pointer",
  },
}));

export const ChatElement = ({
  img,
  // msg,
  // time,
  // unread,
  // online,
  user_id,
  msg,
  time,
  unread,
  picturePath,
  name,
  ...other
}) => {
  const theme = useTheme();
  // const name = `${firstName} ${lastName}`;
  const onlineUsers = useSelector((state) => state.app.onlineUsers);
  // const { current_conversation, conversations } = useSelector(
  //   (state) => state.conversation.direct_chat
  // );
  const online = onlineUsers.includes(user_id);

  const dispatch = useDispatch();
  // console.log(other);
  const conversation = { user_id, img, name, ...other };
  // console.log(conversation);

  const selectedConversation = useSelector(
    (state) => state.conversation.direct_chat.current_conversation
  );
  const isSelected = selectedConversation?.user_id === user_id;
  // console.log(selectedConversation);

  return (
    <StyledChatBox
      onClick={() => {
        dispatch(
          SetCurrentConversation({ current_conversation: conversation })
        );
      }}
      sx={{
        width: "100%",

        borderRadius: 1,

        backgroundColor: isSelected
          ? theme.palette.primary.main
          : theme.palette.background.alt,
      }}
      p={2}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Stack direction={"row"} spacing={2}>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar src={img} />
            </StyledBadge>
          ) : (
            <Avatar src={img} />
          )}
          <Stack spacing={0.3}>
            <Typography
              variant="subtitle2"
              // color={isSelected ? "black" : "white"}
            >
              {name}
            </Typography>
            <Typography variant="caption">{msg}</Typography>
          </Stack>
        </Stack>
        <Stack spacing={2} alignItems={"center"}>
          <Typography sx={{ fontWeight: 500 }} variant="caption">
            {time}
          </Typography>
          <Badge color="primary" badgeContent={unread}></Badge>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};
