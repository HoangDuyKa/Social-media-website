import {
  // ManageAccountsOutlined,
  //   EditOutlined,
  //   LocationOnOutlined,
  // WorkOutlineOutlined,
  Group,
  Delete,
  Message,
  Home,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, IconButton } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FriendListWidget from "./FriendListWidget";
import Friends from "scenes/Dialog/FriendsDialog";

const UserWidget = ({ userId, picturePath }) => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const apiUrl = process.env.REACT_APP_API_URL;

  const getUser = async () => {
    const response = await fetch(`${apiUrl}/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    // location,
    // occupation,
    // viewedProfile,
    // impressions,
    friends,
  } = user;

  return (
    <>
      <WidgetWrapper>
        {/* FIRST ROW */}
        <FlexBetween gap="0.5rem" pb="1.1rem">
          <FlexBetween gap="1rem">
            <UserImage image={picturePath} />
            <Box>
              <Typography
                variant="h4"
                color={dark}
                fontWeight="500"
                sx={{
                  "&:hover": {
                    color: palette.primary.light,
                    cursor: "pointer",
                  },
                }}
                onClick={() => navigate(`/profile/${userId}`)}
              >
                {firstName} {lastName}
              </Typography>
              <Typography color={medium}>{friends.length} friends</Typography>
            </Box>
          </FlexBetween>
          {/* <ManageAccountsOutlined /> */}
        </FlexBetween>

        <Divider />

        {/* SECOND ROW */}
        <Box p="1rem 0">
          <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
            <IconButton
              onClick={() => {
                navigate("/");
              }}
              sx={{
                p: 0,
                width: "max-content",
              }}
            >
              <Home fontSize="large" sx={{ color: dark }} />
            </IconButton>
            <Typography sx={{ fontSize: "1rem" }} color={medium}>
              Home
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
            <IconButton
              onClick={() => {
                handleOpenDialog();
              }}
              sx={{
                p: 0,
                width: "max-content",
              }}
            >
              <Group fontSize="large" sx={{ color: dark }} />
            </IconButton>
            <Typography sx={{ fontSize: "1rem" }} color={medium}>
              Friends
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
            <Message fontSize="large" sx={{ color: dark }} />

            <Typography sx={{ fontSize: "1rem" }} color={medium}>
              Messenger
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
            <IconButton
              onClick={() => {
                navigate(`/trash/${userId}`);
              }}
              sx={{
                p: 0,
                width: "max-content",
              }}
            >
              <Delete fontSize="large" sx={{ color: dark }} />
            </IconButton>

            <Typography sx={{ fontSize: "1rem" }} color={medium}>
              Trash
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ marginBottom: "1rem" }} />
        <FriendListWidget
          style={{ padding: 0, marginTop: "5px" }}
          userId={userId}
        />
      </WidgetWrapper>
      {openDialog && (
        <Friends open={openDialog} handleClose={handleCloseDialog} />
      )}
    </>
  );
};

export default UserWidget;
