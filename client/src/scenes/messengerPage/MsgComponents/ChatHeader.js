import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { faker } from "@faker-js/faker";
import { CaretDown, MagnifyingGlass, Phone, VideoCamera } from "phosphor-react";
import StyledBadge from "components/StyledBadge";
import { toggleRightbar } from "Redux/Slice/app";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidV4 } from "uuid";
const ChatHeader = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );

  const handleVideoCall = () => {
    const roomId = uuidV4(); // Generate a unique room ID
    window.open(`/video-call/${roomId}`, "_blank");
  };
  // const fullName = `${current_conversation?.firstName} ${current_conversation?.lastName}`;
  const onlineUsers = useSelector((state) => state.app.onlineUsers);

  const online = onlineUsers.includes(current_conversation?.user_id);
  return (
    <Box
      p={2}
      sx={{
        // height: 100,
        width: "100%",
        backgroundColor: theme.palette.background.default,
        // theme.palette.mode === "light"
        //   ? "#F8FAFF"
        //   : theme.palette.background.alt,
        boxShadow: "0 0 0 1px rgba(0,0,0,0.25)",
        borderLeft: `1px solid ${theme.palette.background.alt}`,
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{ width: "100%", height: "100%" }}
      >
        <Stack
          direction={"row"}
          spacing={2}
          onClick={() => dispatch(toggleRightbar())}
        >
          <Box>
            {online ? (
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar
                  src={current_conversation?.img}
                  alt={current_conversation?.name}
                />
              </StyledBadge>
            ) : (
              <Avatar
                src={current_conversation?.img}
                alt={current_conversation?.name}
              />
            )}
          </Box>
          <Stack spacing={0.2} direction={"column"}>
            <Typography variant="subtitle2">
              {current_conversation?.name}
            </Typography>
            <Typography variant="caption">
              {online ? "Online" : "Offline"}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} alignItems={"center"} spacing={3}>
          <IconButton onClick={handleVideoCall}>
            <VideoCamera />
          </IconButton>
          <IconButton>
            <Phone />
          </IconButton>
          <IconButton>
            <MagnifyingGlass />
          </IconButton>
          <Divider orientation="vertical" flexItem />
          <IconButton>
            <CaretDown onClick={() => dispatch(toggleRightbar())} />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ChatHeader;
