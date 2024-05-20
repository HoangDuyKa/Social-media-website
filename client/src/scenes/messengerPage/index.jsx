import {
  // Avatar,
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
// import Logo from "../../assets/Images/logo.ico";
import { Nav_Buttons, Nav_Setting } from "../../data";
// import { faker } from "@faker-js/faker";
import AntSwitch from "components/AntSwitch";
import Chats from "./Chats";
import Conversation from "./Conversation";
import { useDispatch, useSelector } from "react-redux";
import { setMode } from "Redux/Slice/app";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "./MsgComponents/ProfileMenu";
import Contact from "./MsgComponents/Contact";
import SharedMessages from "./MsgComponents/SharedMessages";
import StarredMessages from "./MsgComponents/StarredMessages";

function Messenger() {
  const theme = useTheme();
  const [selected, setSelected] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { rightBarChat } = useSelector((state) => state.app);

  return (
    <>
      <Stack direction={"row"} width={"100%"}>
        <Box
          sx={{
            height: "100vh",
            width: 100,
            backgroundColor: theme.palette.background.alt,
            // theme.palette.mode === "light"
            //   ? "#F0F4FA"
            //   : theme.palette.background.alt,
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
          }}
        >
          <Stack
            py={3}
            alignItems={"center"}
            justifyContent="space-between"
            sx={{ height: "100%" }}
          >
            <Stack alignItems={"center"} spacing={4}>
              <Box
                sx={{
                  height: 64,
                  width: 64,
                  borderRadius: 1.5,
                  backgroundColor: theme.palette.primary.main,
                }}
                p={1}
              >
                <Typography
                  fontWeight="bold"
                  fontSize="clamp(1rem, 2rem, 2.25rem)"
                  color="#fff"
                  onClick={() => navigate("/")}
                  sx={{
                    "&:hover": {
                      color: "#fff",
                      cursor: "pointer",
                    },
                  }}
                >
                  CU
                </Typography>
              </Box>
              <Stack
                sx={{ width: "max-content" }}
                direction="column"
                alignItems={"center"}
                spacing={3}
              >
                {Nav_Buttons.map((el) => {
                  return el.index === selected ? (
                    <Box
                      key={el.index}
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: 3,
                      }}
                      p={1}
                    >
                      <IconButton
                        onClick={() => {
                          setSelected(el.index);
                        }}
                        key={el.index}
                        sx={{ width: "max-content", color: "#ffffff" }}
                      >
                        {el.icon}
                      </IconButton>
                    </Box>
                  ) : (
                    <IconButton
                      onClick={() => {
                        setSelected(el.index);
                      }}
                      key={el.index}
                      sx={{
                        width: "max-content",
                        color:
                          theme.palette.mode === "light"
                            ? "#080707"
                            : theme.palette.text.primary,
                      }}
                    >
                      {el.icon}
                    </IconButton>
                  );
                })}
                <Divider sx={{ width: 48 }} />
                {Nav_Setting.map((el) => {
                  return el.index === selected ? (
                    <Box
                      key={el.index}
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: 1.5,
                      }}
                      p={1}
                    >
                      <IconButton
                        onClick={() => {
                          setSelected(el.index);
                        }}
                        sx={{ width: "max-content", color: "#ffffff" }}
                      >
                        {el.icon}
                      </IconButton>
                    </Box>
                  ) : (
                    <IconButton
                      onClick={() => {
                        setSelected(el.index);
                      }}
                      sx={{
                        width: "max-content",
                        color:
                          theme.palette.mode === "light"
                            ? "#080707"
                            : theme.palette.text.primary,
                      }}
                    >
                      {el.icon}
                    </IconButton>
                  );
                })}
              </Stack>
            </Stack>
            <Stack spacing={4}>
              <AntSwitch
                defaultChecked={theme.palette.mode === "dark"}
                onClick={() => dispatch(setMode())}
              />
              {/* Profile Menu */}
              <ProfileMenu />
              {/* <Avatar src={faker.image.avatar()} /> */}
            </Stack>
          </Stack>
        </Box>
        {/* Chats container includes chats, conversation, and rightbarchat components */}
        <Stack direction={"row"} sx={{ width: "100%" }}>
          {/* Chats */}
          <Chats />
          <Box
            sx={{
              height: "100%",
              width: rightBarChat.open
                ? "calc(100vw - 740px)"
                : "calc(100vw - 420px)",
              backgroundColor: theme.palette.background.alt,
              // theme.palette.mode === "light"
              //   ? "#F0F4FA"
              //   : theme.palette.background.alt,
            }}
          >
            {/* Conversation */}
            <Conversation />
          </Box>
          {/* Contact */}
          {rightBarChat.open &&
            (() => {
              switch (rightBarChat.type) {
                case "CONTACT":
                  return <Contact />;
                case "SHARED":
                  return <SharedMessages />;
                case "STARRED":
                  return <StarredMessages />;
                default:
                  break;
              }
            })()}
        </Stack>
      </Stack>
    </>
  );
}

export default Messenger;
