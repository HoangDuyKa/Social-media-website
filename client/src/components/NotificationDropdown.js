import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  setNotifications,
} from "Redux/Slice/notification";
import NotificationItem from "./NotificationItem";
import toast from "react-hot-toast";

const NotificationDropdown = ({ color, fontsize }) => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notification);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const userAuth = useSelector((state) => state.auth.user);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchNotifications = async (userId) => {
      try {
        const response = await fetch(`${apiUrl}/notifications/${userId}`);
        if (response.error) {
          throw new Error("Failed to fetch notifications");
        }
        return response.json();
      } catch (error) {
        toast.error(error.message);
      }
    };
    const fetchUserNotifications = async () => {
      const userId = userAuth._id; // Get userId from your auth state
      const response = await fetchNotifications(userId);
      dispatch(setNotifications({ notifications: response }));
    };

    fetchUserNotifications();

    // const socket = getSocket();
    // socket.on("receiverNofi", (notification) => {
    //   console.log(notification);
    //   dispatch(addNotification(notification));
    // });
  }, [dispatch, userAuth._id]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box>
        <IconButton onClick={handleClick}>
          <Badge
            badgeContent={
              notifications
                ? notifications.filter((n) => !n.isRead).length
                : null
            }
            color="error"
          >
            <NotificationsIcon color={color} fontSize={fontsize} />
          </Badge>
        </IconButton>
        {/* <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {notifications.map((notification) => (
          <MenuItem
            key={notification._id}
            onClick={() => handleMarkAsRead(notification._id)}
          >
            <Typography
              variant="body2"
              color={notification.isRead ? "textSecondary" : "textPrimary"}
            >
              {notification.message}
            </Typography>
          </MenuItem>
        ))}
      </Menu> */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: 410,
              width: 350,
              //   width: "40ch",
            },
          }}
        >
          {notifications?.length === 0 ? (
            <MenuItem onClick={handleClose}>No notifications</MenuItem>
          ) : (
            notifications?.map((notification) => (
              <MenuItem key={notification._id} onClick={handleClose}>
                <NotificationItem notification={notification} />
              </MenuItem>
            ))
          )}
        </Menu>
      </Box>
    </>
  );
};

export default NotificationDropdown;
