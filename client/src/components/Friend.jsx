import {
  Delete,
  DeleteForever,
  PersonAddOutlined,
  PersonRemoveOutlined,
  Public,
  ReportGmailerrorred,
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
import toast from "react-hot-toast";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import StyledBadge from "./StyledBadge";
import { DotsThreeVertical } from "phosphor-react";
import { useState } from "react";
import { setPost, setPosts } from "Redux/Slice/app";

const Friend = ({
  friendId,
  name,
  subtitle,
  userPicturePath,
  // isPost,
  postUserId,
  postId,
  trashPosts,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const { friends } = useSelector((state) => state.auth.user);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = friends.find((friend) => friend._id === friendId);

  const patchFriend = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${_id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);
    dispatch(setFriends({ friends: data }));
  };

  const softDeletePost = async () => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
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
      const response = await fetch(
        `http://localhost:3001/posts/${postId}/force`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
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
      const response = await fetch(
        `http://localhost:3001/posts/${postId}/restore`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      toast.success("Restore Post Successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onlineUsers = useSelector((state) => state.app.onlineUsers);

  const online = onlineUsers.includes(friendId);

  return (
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
              }}
            >
              {name}
            </Typography>
          </Box>
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
          />
        </IconButton>
      ) : (
        <IconButton
          onClick={() => patchFriend()}
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
        >
          {isFriend ? (
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          ) : (
            <PersonAddOutlined sx={{ color: primaryDark }} />
          )}
        </IconButton>
      )}
    </FlexBetween>
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
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
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
          title: isFriend ? "Remove Friend" : "Add Friend",
          handleClick: () => {
            patchFriend().then(handleClose);
          },
          icon: isFriend ? <PersonRemoveOutlined /> : <PersonAddOutlined />,
        },
        {
          title: "Report",
          icon: <ReportGmailerrorred />,
        },
      ]
    : [
        {
          title: "Set Status Post",
          icon: <Public />,
        },
        {
          title: "Delete Post",
          handleClick: () => {
            softDeletePost().then(handleClose);
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

// import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
// import { Box, IconButton, Typography, useTheme } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { setFriends } from "State";
// import FlexBetween from "./FlexBetween";
// import UserImage from "./UserImage";

// const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { _id } = useSelector((state) => state.user);
//   const token = useSelector((state) => state.token);
//   const friends = useSelector((state) => state.user.friends) || []; // Ensure friends is initialized as an array

//   const { palette } = useTheme();
//   const primaryLight = palette.primary.light;
//   const primaryDark = palette.primary.dark;
//   const main = palette.neutral.main;
//   const medium = palette.neutral.medium;

//   const isFriend = friends.find((friend) => friend._id === friendId);

//   const patchFriend = async () => {
//     const response = await fetch(
//       `http://localhost:3001/users/${_id}/${friendId}`,
//       {
//         method: "PATCH",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     const data = await response.json();
//     dispatch(setFriends({ friends: data }));
//   };

//   return (
//     <FlexBetween>
//       <FlexBetween gap="1rem">
//         <UserImage image={userPicturePath} size="55px" />
//         <Box
//           onClick={() => {
//             navigate(`/profile/${friendId}`);
//             navigate(0);
//           }}
//         >
//           <Typography
//             color={main}
//             variant="h5"
//             fontWeight="500"
//             sx={{
//               "&:hover": {
//                 color: palette.primary.light,
//                 cursor: "pointer",
//               },
//             }}
//           >
//             {name}
//           </Typography>
//           <Typography color={medium} fontSize="0.75rem">
//             {subtitle}
//           </Typography>
//         </Box>
//       </FlexBetween>
//       <IconButton
//         onClick={() => patchFriend()}
//         sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
//       >
//         {isFriend ? (
//           <PersonRemoveOutlined sx={{ color: primaryDark }} />
//         ) : (
//           <PersonAddOutlined sx={{ color: primaryDark }} />
//         )}
//       </IconButton>
//     </FlexBetween>
//   );
// };

// export default Friend;
