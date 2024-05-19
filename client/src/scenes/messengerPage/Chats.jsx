import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { ChatElement } from "components/ChatElement";
import { SimpleBarStyle } from "components/Scrollbar";
import { Search, SearchIconWrapper, StyledInputBase } from "components/Search";
import { ChatList } from "../../data";
import { ArchiveBox, CircleDashed, MagnifyingGlass } from "phosphor-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Chats = () => {
  const theme = useTheme();
  const token = useSelector((state) => state.auth.token);

  const [conversations, setConversations] = useState([]);

  // console.log(conversations);

  const getConversations = async () => {
    const res = await fetch(`http://localhost:3001/users/getUsersForSidebar`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const conversations = await res.json();
    setConversations(conversations);
  };

  // console.log(conversations);
  useEffect(() => {
    getConversations();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        width: 320,
        backgroundColor: theme.palette.background.default,
        // theme.palette.mode === "light"
        //   ? "#F8FAFF"
        //   : theme.palette.background.alt,
        boxShadow: (theme.palette.light = "light"
          ? "0 0 2px rgba(0,0,0,0.25)"
          : "0 0 2px rgb(255,255,255)"),
      }}
    >
      <Stack p={3} spacing={2} sx={{ maxHeight: "100vh" }}>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography variant="h3">Chats</Typography>
          <IconButton>
            <CircleDashed />
          </IconButton>
        </Stack>
        <Stack width={"100%"}>
          <Search>
            <SearchIconWrapper>
              <MagnifyingGlass color="#709CE6" />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search..."
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Stack>
        <Stack spacing={1}>
          <Stack spacing={1.5} direction={"row"} alignItems={"center"}>
            <ArchiveBox size={24} />
            <Button>Archive</Button>
          </Stack>
          <Divider />
        </Stack>
        <Stack
          direction={"column"}
          spacing={2}
          sx={{ flexGrow: 1, overflowY: "scroll", height: "100%" }}
        >
          <SimpleBarStyle timeout={500} clickOnTrack={false}>
            {/* <Stack sx={{}} spacing={2.4}>
              <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                Pinned
              </Typography>
              {ChatList.filter((el) => el.pinned).map((el) => {
                return <ChatElement {...el} />;
              })}
            </Stack>
            <Stack sx={{}} spacing={2.4}>
              <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                All Chats
              </Typography>
              {ChatList.filter((el) => !el.pinned).map((el) => {
                return <ChatElement {...el} />;
              })}
            </Stack> */}
            <Stack sx={{}} spacing={2.4}>
              <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                All Chats
              </Typography>
              {conversations
                // .filter((el) => !el.pinned)
                .map((el) => {
                  return <ChatElement key={el._id} {...el} />;
                })}
            </Stack>
          </SimpleBarStyle>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Chats;