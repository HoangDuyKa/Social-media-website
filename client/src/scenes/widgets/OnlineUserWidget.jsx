import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsersObject } from "Redux/Slice/app";

const OnlineUserWidget = ({ userId, style }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const { onlineUsers, onlineUsersObject } = useSelector((state) => state.app);
  const token = useSelector((state) => state.auth.token); 
  const apiUrl = process.env.REACT_APP_API_URL;

  const getOnlineUsers = async () => {
    try {
      const response = await fetch(`${apiUrl}/users/onlineInformation`, {
        method: "POST", 
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ onlineUsers }), 
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to fetch online users.");
      }

      const data = await response.json();
      dispatch(setOnlineUsersObject({ onlineUsersObject: data }));
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    if (onlineUsers && onlineUsers.length > 0) {
      getOnlineUsers();
    }
  }, [onlineUsers]); 

  return (
    <WidgetWrapper style={style}>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Online Users
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {onlineUsersObject && onlineUsersObject.length > 0 ? (
          onlineUsersObject.map((friend) => (
            <Friend
              key={friend._id}
              friendId={friend._id}
              name={`${friend.firstName} ${friend.lastName}`}
              subtitle={friend.occupation}
              userPicturePath={friend.picturePath}
            />
          ))
        ) : (
          <Typography color={palette.neutral.main}>
            No online users available.
          </Typography>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default OnlineUserWidget;
