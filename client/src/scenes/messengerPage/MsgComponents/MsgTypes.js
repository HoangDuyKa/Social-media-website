import {
  Box,
  Divider,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Message_options } from "data";
import { DotsThreeVertical, DownloadSimple, Image } from "phosphor-react";
import { useState } from "react";

const user_id = window.localStorage.getItem("user_id");

const LinkMsg = ({ el }) => {
  const theme = useTheme();
  return (
    <Stack direction={"row"} justifyContent={el.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: el.incoming
            ? theme.palette.background.default
            : theme.palette.primary.main,
        }}
        borderRadius={1.5}
        width={"max-content"}
      >
        <Stack spacing={2}>
          <Stack
            p={2}
            direction={"column"}
            spacing={3}
            alignItems={"start"}
            sx={{
              backgroundColor: theme.palette.background.alt,
              borderRadius: 1,
            }}
          >
            <img
              src={el.preview}
              alt={el.message}
              style={{
                borderRadius: "10px",
                maxHeight: 210,
                maxWidth: "100%",
                display: "block",
              }}
            />
            <Stack spacing={2}>
              <Typography variant="subtitle2">Creating chat app</Typography>
              <Typography
                variant="subtitle2"
                component={Link}
                to={"https://youtube.com"}
                sx={{ color: theme.palette.primary.mess }}
              >
                www.youtube.com
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              sx={{ color: el.incoming ? theme.palette.text : "#FFF" }}
            >
              {el.message}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};

const DocMsg = ({ el }) => {
  const theme = useTheme();
  return (
    <Stack direction={"row"} justifyContent={el.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: el.incoming
            ? theme.palette.background.default
            : theme.palette.primary.mess,
        }}
        borderRadius={1.5}
        width={"max-content"}
      >
        <Stack spacing={2}>
          <Stack
            direction={"row"}
            spacing={3}
            alignItems={"center"}
            sx={{
              backgroundColor: theme.palette.background.alt,
              borderRadius: 1,
            }}
          >
            <Image size={48} />
            <Typography variant="caption">Abstract.png</Typography>
            <IconButton>
              <DownloadSimple />
            </IconButton>
          </Stack>
          <Typography
            variant="body2"
            sx={{ color: el.incoming ? theme.palette.text : "#FFF" }}
          >
            {el.message}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
};

const ReplyMsg = ({ el }) => {
  const theme = useTheme();
  return (
    <Stack direction={"row"} justifyContent={el.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: el.incoming
            ? theme.palette.background.default
            : theme.palette.primary.mess,
        }}
        borderRadius={1.5}
        width={"max-content"}
      >
        <Stack spacing={2}>
          <Stack
            p={2}
            direction={"column"}
            spacing={3}
            alignItems={"center"}
            sx={{
              backgroundColor: theme.palette.background.alt,
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" color={theme.palette.text}>
              {el.message}
            </Typography>
          </Stack>
          <Typography
            variant="body2"
            color={el.incoming ? theme.palette.text : "#fff"}
          >
            {el.reply}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
};

const MediaMsg = ({ el }) => {
  const theme = useTheme();

  return (
    <Stack direction={"row"} justifyContent={el.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: el.incoming
            ? theme.palette.background.default
            : theme.palette.primary.main,
        }}
        borderRadius={1.5}
        width={"max-content"}
      >
        <Stack spacing={1}>
          <img
            src={el.img}
            alt={el.message}
            style={{ borderRadius: "10px", maxHeight: 210 }}
          />
          <Typography
            variant="body2"
            color={el.incoming ? theme.palette.text : "#fff"}
          >
            {el.message}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
};

const TextMsg = ({ el, menu }) => {
  const theme = useTheme();
  const receiver = el.receiverId === user_id;
  const placement = el.receiverId === user_id ? "left" : "right";
  // const placement = el.incoming ? "left" : "right";

  return receiver ? (
    <Stack direction={"row"} justifyContent={receiver ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: receiver
            ? theme.palette.background.default
            : theme.palette.primary.main,
        }}
        borderRadius={1.5}
        width={"max-content"}
      >
        <Typography
          variant="body2"
          color={receiver ? theme.palette.text : "#fff"}
        >
          {el.message}
        </Typography>
      </Box>
      {<MessageOption placement={placement} />}
    </Stack>
  ) : (
    <Stack direction={"row"} justifyContent={receiver ? "start" : "end"}>
      {<MessageOption placement={placement} />}

      <Box
        p={1.5}
        sx={{
          backgroundColor: receiver
            ? theme.palette.background.default
            : theme.palette.primary.mess,
        }}
        borderRadius={1.5}
        width={"max-content"}
      >
        <Typography
          variant="body2"
          color={receiver ? theme.palette.text : "#fff"}
        >
          {el.message}
        </Typography>
      </Box>
    </Stack>
  );
};

const MessageOption = ({ placement }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <DotsThreeVertical
        size={20}
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        placement="left"
        cursor={"pointer"}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: placement }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Stack spacing={1} px={1}>
          {Message_options.map((el) => (
            <MenuItem onClick={handleClose}>{el.title}</MenuItem>
          ))}
        </Stack>
      </Menu>
    </>
  );
};

const Timeline = ({ el }) => {
  const theme = useTheme();
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Divider width="46%" />
      <Typography variant={"caption"} sx={{ color: theme.palette.text }}>
        {el.text}
      </Typography>
      <Divider width="46%" />
    </Stack>
  );
};

export { Timeline, TextMsg, MediaMsg, ReplyMsg, DocMsg, LinkMsg };
