import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import PostsWidget from "scenes/widgets/PostsWidget";
import { useParams } from "react-router-dom";

const DetailPost = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id } = useSelector((state) => state.auth.user);
  const params = useParams();

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
        {isNonMobileScreens && (
          <Box flexBasis={isNonMobileScreens ? "26%" : undefined}></Box>
        )}

        <Box
          flexBasis={isNonMobileScreens ? "62%" : undefined}
          // flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <PostsWidget userId={_id} detailPost postId={params.postId} />
        </Box>
        {isNonMobileScreens && <Box flexBasis="26%"></Box>}
      </Box>
    </Box>
  );
};

export default DetailPost;
