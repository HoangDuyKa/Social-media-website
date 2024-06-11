import React, { useRef, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { setCurrentMessages } from "Redux/Slice/conversation";

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

const ChatInput = ({ setOpenPickerr, setMessage, message, inputRef }) => {
  const [openActions, setOpenActions] = useState(false);

  return (
    <StyledInput
      onChange={setMessage}
      value={message}
      inputRef={inputRef}
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
                <Tooltip placement="right" key={el.title} title={el.title}>
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
                setOpenPickerr((pre) => !pre);
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
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  function handleEmojiClick(emoji) {
    const input = inputRef.current;

    if (input) {
      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;

      setMessage(
        message.substring(0, selectionStart) +
          emoji +
          message.substring(selectionEnd)
      );

      // Move the cursor to the end of the inserted emoji
      input.selectionStart = input.selectionEnd = selectionStart + 1;
    }
  }

  const { current_messages, current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const token = useSelector((state) => state.auth.token);

  const sendMessage = async (message, type) => {
    try {
      const res = await fetch(
        `${apiUrl}/messages/send/${current_conversation.user_id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message, type }),
        }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      dispatch(
        setCurrentMessages({ current_messages: [...current_messages, data] })
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleChangeMessage = (e) => {
    setMessage(e.target.value);
  };

  function containsUrl(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return urlRegex.test(text);
  }

  const handleSendMessage = async () => {
    const type = containsUrl(message) ? "Link" : "Text";
    if (!message) return;
    await sendMessage(message, type);
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
            onEmojiSelect={(emoji) => {
              handleEmojiClick(emoji.native);
            }}
          />
        </Box>
        {/* Chat Input */}
        <ChatInput
          setOpenPickerr={setOpenPicker}
          setMessage={handleChangeMessage}
          message={message}
          inputRef={inputRef}
          openPicker={openPicker}
        />

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
