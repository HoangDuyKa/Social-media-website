import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";
import FormEditUser from "./FormEditUser";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const { _id } = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const [editUser, setEditUser] = useState(false);

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget
            userId={userId}
            picturePath={user.picturePath}
            editUser={editUser}
            setEditUser={setEditUser}
          />
          <Box m="2rem 0" />
          <FriendListWidget userId={userId} />
        </Box>
        {editUser ? (
          <Box
            flexBasis={isNonMobileScreens ? "74%" : undefined}
            mt={isNonMobileScreens ? undefined : "2rem"}
          >
            <FormEditUser user={user} setEditUser={setEditUser} />
          </Box>
        ) : (
          <Box
            flexBasis={isNonMobileScreens ? "74%" : undefined}
            mt={isNonMobileScreens ? undefined : "2rem"}
          >
            {userId === _id && (
              <MyPostWidget picturePath={user.picturePath} isProfile />
            )}

            <Box m="2rem 0" />
            <PostsWidget userId={userId} isProfile />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProfilePage;
