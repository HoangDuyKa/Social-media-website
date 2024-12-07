import {
  Delete,
  DeleteForever,
  Edit,
  Lock,
  PersonAddOutlined,
  PersonRemoveOutlined,
  PrivacyTipRounded,
  Public,
  ReportGmailerrorred,
  Save,
  Check,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Restore } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "../Redux/Slice/auth";
import { toast } from "sonner";

import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import StyledBadge from "./StyledBadge";
import { DotsThreeVertical, Pencil } from "phosphor-react";
import { useEffect, useState } from "react";
import { setPost, setPosts } from "Redux/Slice/app";
import { getSocket } from "socket";
const user_id = window.localStorage.getItem("user_id");
const Friend = ({
  friendId,
  name,
  subtitle,
  userPicturePath,
  // isPost,
  postUserId,
  postId,
  trashPosts,
  storagePage,
  userId,
  isAnniversaryPost,
  statusPost,
  editingPost,
  setEditingPost,
  isProfile,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const { friends } = useSelector((state) => state.auth.user);
  const apiUrl = process.env.REACT_APP_API_URL;
  const socket = getSocket();
  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const { firstName } = useSelector((state) => state.auth.user);
  const [friendRequests, setFriendRequests] = useState([]);
  const isFriend = friends.find((friend) => friend._id === friendId);

  const patchFriend = async () => {
    try {
      const response = await fetch(`${apiUrl}/users/${_id}/${friendId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      dispatch(setFriends({ friends: data }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const patchStatus = async () => {
    try {
      const response = await fetch(`${apiUrl}/posts/${postId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);
      if (data.error) throw new Error(data.error);
      dispatch(setPost({ post: data }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const softDeletePost = async () => {
    try {
      const response = await fetch(`${apiUrl}/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      dispatch(setPosts({ posts: data }));
      toast.success("Deleted successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const destroyPost = async () => {
    try {
      const response = await fetch(`${apiUrl}/posts/${postId}/force`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      dispatch(setPosts({ posts: data }));
      toast.success("Deleted Forever Successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const restorePost = async () => {
    try {
      const response = await fetch(`${apiUrl}/posts/${postId}/restore`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      toast.success("Restore Post Successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const savePost = async () => {
    try {
      const response = await fetch(`${apiUrl}/posts/${postId}/save`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: _id,
        }),
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      toast.success("Save Post Successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };
  const unsavePost = async () => {
    try {
      const response = await fetch(`${apiUrl}/posts/${postId}/unsave`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: _id,
        }),
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      toast.success("Unsave Post Successfully");
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
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getFriendRequest();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onlineUsers = useSelector((state) => state.app.onlineUsers);

  const online = onlineUsers.includes(friendId);

  return (
    <>
      <FlexBetween>
        <FlexBetween gap="1rem">
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <UserImage image={userPicturePath} size="55px" />
            </StyledBadge>
          ) : (
            <UserImage image={userPicturePath} size="55px" />
          )}

          <Box>
            <Box
              onClick={() => {
                navigate(`/profile/${friendId}`);
                navigate(0);
              }}
            >
              <Typography
                color={main}
                variant="h5"
                fontWeight="500"
                sx={{
                  maxWidth: "200px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  "&:hover": {
                    color: palette.primary.light,
                    cursor: "pointer",
                  },
                  display: "flex",
                }}
              >
                {name}
                {postId ? (
                  statusPost === "public" ? (
                    <Public sx={{ marginLeft: 1 }} />
                  ) : (
                    <Lock sx={{ marginLeft: 1 }} />
                  )
                ) : (
                  <></>
                )}
              </Typography>
            </Box>
            {postId ? (
              <Typography
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                    textDecoration: "underline",
                  },
                }}
                color={medium}
                fontSize="0.75rem"
                onClick={() => {
                  navigate(`/detail/post/${postId}`);
                }}
              >
                {subtitle}
              </Typography>
            ) : (
              <Typography color={medium} fontSize="0.75rem">
                {subtitle}
              </Typography>
            )}
          </Box>
        </FlexBetween>
        {postId ? (
          <IconButton
            // onClick={() => patchFriend()}
            sx={{ backgroundColor: primaryLight }}
          >
            <PostOption
              sx={{ color: primaryDark }}
              patchFriend={patchFriend}
              isFriend={isFriend}
              postUserId={postUserId}
              _id={_id}
              trashPosts={trashPosts}
              softDeletePost={softDeletePost}
              destroyPost={destroyPost}
              restorePost={restorePost}
              savePost={savePost}
              storagePage={storagePage}
              unsavePost={unsavePost}
              isAnniversaryPost={isAnniversaryPost}
              patchStatus={patchStatus}
              statusPost={statusPost}
              setEditingPost={setEditingPost}
              editingPost={editingPost}
              socket={socket}
              friendId={friendId}
              isProfile={isProfile}
            />
          </IconButton>
        ) : userId === _id ? (
          <></>
        ) : (
          <IconButton
            // onClick={
            //   isFriend
            //     ? () => patchFriend()
            //     : () => {
            //         socket.emit(
            //           "friend_request",
            //           { to: friendId, from: user_id, name: firstName }
            //           // toast.success("Request sent")
            //         );
            //       }
            // }
            sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
          >
            {friendRequests?.some(
              (request) => request.sender._id === friendId
            ) ? (
              <Check
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  const request = friendRequests.find(
                    (request) => request.sender._id === friendId
                  );
                  if (request) {
                    socket.emit("accept_request", { request_id: request._id });
                    window.location.reload();
                  } else {
                    console.error("Friend request not found");
                  }
                }}
              />
            ) : isFriend ? (
              <PersonRemoveOutlined
                onClick={() => patchFriend()}
                sx={{ color: primaryDark }}
              />
            ) : (
              <PersonAddOutlined
                onClick={() => {
                  socket.emit("friend_request", {
                    to: friendId,
                    from: user_id,
                    name: firstName,
                  });
                }}
                sx={{ color: primaryDark }}
              />
            )}
          </IconButton>
        )}
      </FlexBetween>
    </>
  );
};

const PostOption = ({
  patchFriend,
  isFriend,
  postUserId,
  _id,
  trashPosts,
  softDeletePost,
  destroyPost,
  restorePost,
  savePost,
  storagePage,
  unsavePost,
  isAnniversaryPost,
  patchStatus,
  statusPost,
  editPost,
  setEditingPost,
  editingPost,
  socket,
  friendId,
  isProfile,
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { firstName } = useSelector((state) => state.auth.user);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const Post_options = trashPosts
    ? [
        {
          title: "Restore Post",
          handleClick: () => {
            restorePost().then(navigate("/"));
          },
          icon: <Restore />,
        },
        {
          title: "Delete Forever",
          handleClick: () => {
            destroyPost().then(handleClose);
          },
          icon: <DeleteForever />,
        },
      ]
    : postUserId !== _id
    ? [
        {
          title: storagePage ? "Unsave Post" : "Save this Post",
          handleClick: () => {
            storagePage
              ? unsavePost().then(navigate("/"))
              : savePost().then(handleClose);
          },
          icon: storagePage ? <Delete /> : <Save />,
        },
        isProfile ? (
          <></>
        ) : (
          {
            title: isFriend ? "Remove Friend" : "Add Friend",
            handleClick: isFriend
              ? () => {
                  patchFriend().then(handleClose);
                }
              : () => {
                  socket.emit(
                    "friend_request",
                    { to: friendId, from: user_id, name: firstName },
                    handleClose()
                    // toast.success("Request sent")
                  );
                },
            icon: isFriend ? <PersonRemoveOutlined /> : <PersonAddOutlined />,
          }
        ),

        {
          title: "Report",

          icon: <ReportGmailerrorred />,
        },
      ]
    : [
        statusPost === "public"
          ? {
              title: "Set Status Private",

              handleClick: () => {
                patchStatus().then(navigate(`/profile/${_id}`));
              },
              icon: <Lock />,
            }
          : {
              title: "Set Status Public",

              handleClick: () => {
                patchStatus().then(navigate("/"));
              },
              icon: <Public />,
            },
        {
          title: "Edit Post",
          handleClick: () => {
            setEditingPost(!editingPost);
            handleClose();
          },
          icon: <Edit />,
        },
        {
          title: "Delete Post",
          handleClick: () => {
            isAnniversaryPost
              ? destroyPost().then(navigate("/"))
              : softDeletePost().then(handleClose);
          },
          icon: <Delete />,
        },
      ];
  return (
    <>
      <DotsThreeVertical
        size={24}
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
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Stack spacing={1} px={1}>
          {Post_options.map((el) => (
            <MenuItem
              key={el.title}
              onClick={el.handleClick ? el.handleClick : handleClose}
            >
              <Typography marginRight={"1rem"}>{el.title}</Typography>
              <Box sx={{ position: "absolute", right: 0 }}>{el.icon}</Box>
            </MenuItem>
          ))}
        </Stack>
      </Menu>
    </>
  );
};

export default Friend;
