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
import { useDispatch } from "react-redux";

const ChatHeader = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
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
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar src={faker.image.avatar()} alt={faker.name.fullName()} />
            </StyledBadge>
          </Box>
          <Stack spacing={0.2} direction={"column"}>
            <Typography variant="subtitle2">{faker.name.fullName()}</Typography>
            <Typography variant="caption">Online</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} alignItems={"center"} spacing={3}>
          <IconButton>
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
