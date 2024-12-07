import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
  PersonAddOutlined,
  PersonRemoveOutlined,
  CleaningServices,
  Clear,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CheckIcon from "@mui/icons-material/Check";
import { getSocket } from "socket";
import { setFriends } from "Redux/Slice/auth";
const UserWidget = ({ userId, picturePath, editUser, setEditUser }) => {
  const [user, setUser] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const logginUser = useSelector((state) => state.auth.user);
  const apiUrl = process.env.REACT_APP_API_URL;
  const socket = getSocket();
  const dispatch = useDispatch();

  const getUser = async () => {
    try {
      const response = await fetch(`${apiUrl}/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setUser(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getFriendRequest = async () => {
    try {
      const responses = await fetch(`${apiUrl}/users/get-requests`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await responses.json();
      setFriendRequests(response.data);
      // dispatch({ friendRequests: response.data });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const patchFriend = async () => {
    const response = await fetch(
      `${apiUrl}/users/${logginUser._id}/${userId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    // console.log(data);
    dispatch(setFriends({ friends: data }));
  };

  useEffect(() => {
    getUser();
    getFriendRequest();
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
  } = user;

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${userId}`)}
      >
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
            >
              {firstName} {lastName}
            </Typography>
            <Typography color={medium}>{friends.length} friends</Typography>
          </Box>
        </FlexBetween>
        {logginUser._id === user._id ? (
          <ManageAccountsOutlined
            sx={{ cursor: "pointer" }}
            onClick={() => setEditUser(!editUser)}
          />
        ) : friendRequests?.some((request) => request.sender._id === userId) ? (
          <Box
            display="flex"
            gap="1rem"
            justifyContent="center"
            alignItems="center"
          >
            <Clear
              sx={{ cursor: "pointer" }}
              onClick={() => {
                // Find the request corresponding to the sender and get its _id
                const request = friendRequests.find(
                  (request) => request.sender._id === userId
                );

                if (request) {
                  socket.emit("deny_request", { request_id: request._id });
                  window.location.reload();
                } else {
                  console.error("Friend request not found");
                }
              }}
            />

            <CheckIcon
              sx={{ cursor: "pointer" }}
              onClick={() => {
                const request = friendRequests.find(
                  (request) => request.sender._id === userId
                );
                if (request) {
                  socket.emit("accept_request", { request_id: request._id });
                  window.location.reload();
                } else {
                  console.error("Friend request not found");
                }
              }}
            />
          </Box>
        ) : user.friends.includes(logginUser._id) ? (
          <PersonRemoveOutlined
            sx={{ cursor: "pointer" }}
            onClick={() => patchFriend().then(window.location.reload())}
          />
        ) : (
          <PersonAddOutlined
            sx={{ cursor: "pointer" }}
            onClick={() => {
              socket.emit("friend_request", {
                to: userId,
                from: logginUser._id,
                name: logginUser.firstName,
              });
            }}
          />
        )}
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{occupation}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Who's viewed your profile</Typography>
          <Typography color={main} fontWeight="500">
            {viewedProfile}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Impressions of your post</Typography>
          <Typography color={main} fontWeight="500">
            {impressions}
          </Typography>
        </FlexBetween>
      </Box>

      <Divider />

      {/* FOURTH ROW */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>

        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <img src="../assets/twitter.png" alt="twitter" />
            <Box>
              <Typography color={main} fontWeight="500">
                Twitter
              </Typography>
              <Typography color={medium}>Social Network</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>

        <FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <img src="../assets/linkedin.png" alt="linkedin" />
            <Box>
              <Typography color={main} fontWeight="500">
                Linkedin
              </Typography>
              <Typography color={medium}>Network Platform</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
