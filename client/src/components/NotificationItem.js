import React from "react";
import { useDispatch, useSelector } from "react-redux";
// import { updateNotificationStatus } from "../redux/slices/notificationSlice";
import {
  Avatar,
  Badge,
  Box,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  CheckCircle,
  Favorite,
  Comment,
  PersonAdd,
  FiberManualRecord,
} from "@mui/icons-material";
import { markAsRead } from "Redux/Slice/notification";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const NotificationItem = ({ notification }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const token = useSelector((state) => state.auth.token);
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const handleMarkAsRead = async (id) => {
    try {
      const response = await fetch(
        `${apiUrl}/notifications/updateNotification/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isRead: true }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update notification status");
      }

      const updatedNotification = await response.json();
      dispatch(markAsRead(id));
      return updatedNotification;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClickNotification = () => {
    handleMarkAsRead(notification._id);
    navigate(notification.navigator);
  };

  const getIcon = (type) => {
    switch (type) {
      case "like":
        return <Favorite style={{ color: theme.palette.error.main }} />;
      case "comment":
        return <Comment style={{ color: theme.palette.primary.main }} />;
      case "friend_request":
        return <PersonAdd style={{ color: theme.palette.success.main }} />;
      default:
        return <CheckCircle style={{ color: theme.palette.grey[500] }} />;
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      p={2}
      bgcolor={notification.isRead ? "grey.100" : "grey.300"}
      borderRadius={2}
      mb={1}
      //   onClick={handleMarkAsRead}
      onClick={handleClickNotification}
      sx={{ cursor: "pointer" }}
    >
      <Badge
        overlap="circular"
        badgeContent={getIcon(notification.type)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Avatar src={notification.userSender.picturePath} alt="Sender" />
      </Badge>
      <Box ml={2} flexGrow={1}>
        <Typography
          variant="body1"
          sx={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
        >
          {notification.message}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {new Date(notification.createdAt).toLocaleString()}
        </Typography>
      </Box>
      {!notification.isRead ? (
        // <IconButton size="small" onClick={handleMarkAsRead}>
        <IconButton size="small">
          <FiberManualRecord style={{ color: theme.palette.primary.main }} />
        </IconButton>
      ) : (
        <IconButton size="small">
          <CheckCircle style={{ color: theme.palette.success.main }} />
        </IconButton>
      )}
    </Box>
  );
};

export default NotificationItem;
