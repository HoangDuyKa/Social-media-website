import React, { useState } from "react";
import {
  Box,
  Fab,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  styled,
  useTheme,
} from "@mui/material";

import {
  Camera,
  File,
  Image,
  LinkSimple,
  PaperPlaneTilt,
  Smiley,
  Sticker,
  User,
} from "phosphor-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useSelector } from "react-redux";
import { setMessages } from "Redux/Slice/conversation";

const StyledInput = styled(TextField)(({ theme }) => ({
  "&.MuiInputBase-input": {
    paddingTop: "12px !important",
    paddingBottom: "12px !important",
  },
}));

const Actions = [
  {
    color: "#4da5fe",
    icon: <Image size={24} />,
    y: 102,
    title: "Photo/Video",
  },
  {
    color: "#1b8cfe",
    icon: <Sticker size={24} />,
    y: 172,
    title: "Stickers",
  },
  {
    color: "#0172e4",
    icon: <Camera size={24} />,
    y: 242,
    title: "Image",
  },
  {
    color: "#0159b2",
    icon: <File size={24} />,
    y: 312,
    title: "Document",
  },
  {
    color: "#013f7f",
    icon: <User size={24} />,
    y: 382,
    title: "Contact",
  },
];

const ChatInput = ({ setOpenPicker, setMessage }) => {
  const [openActions, setOpenActions] = useState(false);

  return (
    <StyledInput
      onChange={(e) => setMessage(e.target.value)}
      fullWidth
      placeholder="Write a message..."
      variant="filled"
      InputProps={{
        disableUnderline: true,
        startAdornment: (
          <Stack sx={{ width: "max-content" }}>
            <Stack
              sx={{
                position: "relative",
                display: openActions ? "inline-block" : "none",
              }}
            >
              {Actions.map((el) => (
                <Tooltip placement="right" title={el.title}>
                  <Fab
                    sx={{
                      position: "absolute",
                      top: -el.y,
                      backgroundColor: el.color,
                    }}
                  >
                    {el.icon}
                  </Fab>
                </Tooltip>
              ))}
            </Stack>
            <InputAdornment>
              <IconButton
                onClick={() => {
                  setOpenActions(!openActions);
                }}
              >
                <LinkSimple />
              </IconButton>
            </InputAdornment>
          </Stack>
        ),
        endAdornment: (
          <InputAdornment>
            <IconButton
              onClick={() => {
                setOpenPicker((pre) => !pre);
              }}
            >
              <Smiley />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

const ChatFooter = () => {
  const theme = useTheme();
  const [openPicker, setOpenPicker] = useState(false);
  const [message, setMessage] = useState("");

  const { messages, selectedConversation } = useSelector(
    (state) => state.conversation
  );
  const token = useSelector((state) => state.auth.token);

  const sendMessage = async (message) => {
    try {
      const res = await fetch(
        `http://localhost:3001/messages/send/${selectedConversation._id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ message }),
        }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages([...messages, data]);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSendMessage = () => {
    sendMessage(message);
    setMessage("");
  };

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
      <Stack direction={"row"} alignItems={"center"} spacing={3}>
        <Box
          sx={{
            display: openPicker ? "block" : "none",
            zIndex: 10,
            position: "fixed",
            bottom: 92,
            right: 100,
          }}
        >
          <Picker
            theme={theme.palette.mode}
            data={data}
            onEmojiSelect={console.log}
          />
        </Box>
        {/* Chat Input */}
        <ChatInput setOpenPicker={setOpenPicker} setMessage={setMessage} />

        <Box
          sx={{
            height: 48,
            width: 48,
            backgroundColor: theme.palette.primary.main,
            borderRadius: 1.5,
          }}
        >
          <Stack
            sx={{
              height: "100%",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton onClick={handleSendMessage}>
              <PaperPlaneTilt color="#fff" />
            </IconButton>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default ChatFooter;
