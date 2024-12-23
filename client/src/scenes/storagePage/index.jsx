import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
// import UserWidget from "scenes/widgets/UserWidget";
import FeatureWidget from "scenes/widgets/FeatureWidget";
import PostsWidget from "scenes/widgets/PostsWidget";

const StoragePost = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.auth.user);

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          {/* <UserWidget userId={_id} picturePath={picturePath} /> */}
          {isNonMobileScreens && (
            <FeatureWidget userId={_id} picturePath={picturePath} />
          )}
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "80%" : undefined}
          // mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <PostsWidget userId={_id} picturePath={picturePath} storagePage />
        </Box>
      </Box>
    </Box>
  );
};

export default StoragePost;
