import { Box, Container, Typography, useMediaQuery } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import FeatureWidget from "scenes/widgets/FeatureWidget";
import PostWidget from "scenes/widgets/PostWidget";

const Search = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.auth.user);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = useSelector((state) => state.auth.token);

  const handleSearch = async () => {
    const response = await fetch(`${apiUrl}/search`, {
      method: "POST",
      headers: {
        // Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    console.log(data);

    setResults(data);
  };
  console.log(results);
  return (
    <Box>
      <Navbar />

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for images or videos"
      />
      <button onClick={handleSearch}>Search</button>
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
            {results.length >= 1 ? (
              <>
                {results.length >= 1 && (
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
                    {results.map((post) => (
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

export default Search;
