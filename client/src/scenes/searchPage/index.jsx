import { Box, Container, Typography, useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import FeatureWidget from "scenes/widgets/FeatureWidget";
import { useEffect, useState } from "react";
import { setPosts } from "Redux/Slice/app";
import { useLocation } from "react-router-dom";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import PostWidget from "scenes/widgets/PostWidget";

const SearchPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.auth.user);
  //   const searchResults = useSelector((state) => state.app.searchResults);
  const [results, setResults] = useState({ users: [], posts: [] });
  const posts = useSelector((state) => state.app.posts);

  const location = useLocation();
  const [params, setParams] = useState({});

  const apiUrl = process.env.REACT_APP_API_URL;
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const queryParams = {};
    // Retrieve all key-value pairs from the query string
    query.forEach((value, key) => {
      queryParams[key] = value;
    });
    setParams(queryParams);
  }, [location.search]); // Runs only when location.search changes

  const handleSearch = async (query) => {
    try {
      const response = await fetch(`${apiUrl}/search?query=${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setResults(data);
      dispatch(setPosts({ posts: data.posts }));
      //   dispatch(setSearchResults({ searchResults: data }));
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  useEffect(() => {
    if (params["query"]) {
      handleSearch(params["query"]);
    }
  }, [params]); // Runs only when params changes

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
          {isNonMobileScreens && (
            <FeatureWidget userId={_id} picturePath={picturePath} />
          )}
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "74%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <Container>
            {results.users.length >= 1 || results.posts.length >= 1 ? (
              <>
                {results.users.length >= 1 && (
                  <div>
                    <Typography
                      fontWeight="500"
                      variant="h3"
                      color="#A3A3A3"
                      textAlign={"center"}
                    >
                      <span>--- </span>
                      Users
                      <span> ---</span>
                    </Typography>
                    {results.users.map((user) => (
                      //   <UserSearch key={user._id} user={user} />
                      <WidgetWrapper m={"0 0 1rem"}>
                        <Friend
                          userPicturePath={user.picturePath}
                          name={`${user.firstName} ${user.lastName}`}
                          {...user}
                          subtitle={user.location}
                          userId={user._id}
                          friendId={user._id}
                        />
                      </WidgetWrapper>
                    ))}
                  </div>
                )}
                {results.posts.length >= 1 && (
                  <div>
                    <Typography
                      fontWeight="500"
                      variant="h3"
                      color="#A3A3A3"
                      textAlign={"center"}
                    >
                      <span>--- </span>
                      Posts
                      <span> ---</span>
                    </Typography>
                    {posts.map((post) => (
                      //   <PostSearch key={post._id} post={post} />
                      <PostWidget
                        name={`${post.userPost.firstName} ${post.userPost.lastName}`}
                        description={post.description}
                        location
                        file={post.file}
                        userPicturePath={post.userPost.picturePath}
                        comments={post.comments}
                        postId={post._id}
                        likes={post.likes}
                        postUserId={post.userId}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Typography
                fontWeight="500"
                variant="h3"
                color="#A3A3A3"
                textAlign={"center"}
              >
                No Data Found!
              </Typography>
            )}
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default SearchPage;
