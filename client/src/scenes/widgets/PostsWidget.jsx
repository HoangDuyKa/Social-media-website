import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "Redux/Slice/app";
import PostWidget from "./PostWidget";
import { CircularProgress, Stack, Typography } from "@mui/material";
import { toast } from "sonner";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "components/Loading";

const PostsWidget = ({
  userId,
  isProfile = false,
  trashPosts = false,
  storagePage = false,
  detailPost = false,
  memoryPage = false,
  isAnniversaryPost = false,
  homePage = false,
  postId,
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const posts = useSelector((state) => state.app.posts || []);
  const [loading, setLoading] = useState(true); // Add loading state
  const totalPosts = 100;
  const postsLimit = 3;
  const [page, setPage] = useState(1); // State for page number
  const [hasMore, setHasMore] = useState(true); // State for whether there are more posts to load
  // const [infinitePosts, setInfinitePosts] = useState([]); // State for whether there are more posts to load
  const apiUrl = process.env.REACT_APP_API_URL;
  // console.log("posts", posts);
  // console.log("infinitePosts", infinitePosts);

  // console.log("infinitePosts", infinitePosts);
  // console.log("page", page);
  const getPosts = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/posts?page=${page}&limit=${postsLimit}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();

      if (!data.error) {
        if (page === 1) {
          // setInfinitePosts(data);
          dispatch(setPosts({ posts: data }));
        } else {
          dispatch(setPosts({ posts: [...posts, ...data] }));
          // setInfinitePosts((prevPosts) => [...prevPosts, ...data]);
        }
        setPage(page + 1);
        // Increment the page number for the next batch
      } else {
        throw new Error(data.error);
      }

      // If fewer posts returned than limit, there are no more posts to fetch
      if (data.length < postsLimit) {
        setHasMore(false); // No more posts to load
      }

      // Dispatch the fetched posts to Redux, appending them to the existing ones
    } catch (error) {
      console.log(error.message); // Dispatch error to Redux state
      toast.error(error.message); // Display error toast
    } finally {
      dispatch(setLoading(false)); // Stop loading state
    }
  };

  const getUserPosts = async () => {
    try {
      const response = await fetch(`${apiUrl}/posts/${userId}/posts`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };
  const getUserTrash = async () => {
    try {
      const response = await fetch(`${apiUrl}/posts/${userId}/trash`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const getUserStorage = async () => {
    try {
      const response = await fetch(`${apiUrl}/posts/${userId}/storage`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const getUserMemory = async () => {
    try {
      const response = await fetch(`${apiUrl}/posts/${userId}/memory`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const getDetailPost = async () => {
    try {
      const response = await fetch(`${apiUrl}/posts/detail/${postId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    setLoading(true); // Set loading to true before fetching data
    if (isProfile) {
      getUserPosts();
    } else if (trashPosts) {
      getUserTrash();
    } else if (detailPost) {
      getDetailPost();
    } else if (storagePage) {
      getUserStorage();
    } else if (memoryPage) {
      getUserMemory();
    } else if (homePage) {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return <Loading />;
  }

  const fetchMoreData = async () => {
    if (hasMore) {
      getPosts();
    }
  };

  return (
    <>
      {homePage ? (
        <>
          {posts.length === 0 ? (
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Typography fontWeight="500" variant="h3" color="#A3A3A3">
                There are no posts
              </Typography>
            </Stack>
          ) : (
            <InfiniteScroll
              dataLength={posts.length}
              next={fetchMoreData}
              // hasMore={posts.length < totalPosts}
              hasMore={hasMore} // Whether there are more posts to load
              loader={
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  Loading...
                </Stack>
              }
              endMessage={
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  No more posts to show
                </Stack>
              }
            >
              {posts.map(
                ({
                  _id,
                  userPost,
                  description,
                  file,
                  likes,
                  comments,
                  anniversariesCelebrated,
                  status,
                }) => (
                  <PostWidget
                    key={_id}
                    postId={_id}
                    postUserId={userPost?._id}
                    statusPost={status}
                    name={`${userPost?.firstName} ${userPost?.lastName}`}
                    description={description}
                    location={userPost?.location}
                    file={file}
                    userPicturePath={userPost?.picturePath}
                    likes={likes}
                    comments={comments}
                    trashPosts={trashPosts}
                    storagePage={storagePage}
                    detailPost={detailPost}
                    isAnniversaryPost={isAnniversaryPost}
                    anniversariesCelebrated={anniversariesCelebrated}
                  />
                )
              )}
            </InfiniteScroll>
          )}
        </>
      ) : (
        <>
          {posts.length === 0 ? (
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Typography fontWeight="500" variant="h3" color="#A3A3A3">
                There are no posts
              </Typography>
            </Stack>
          ) : (
            posts.map(
              ({
                // _id,
                // userId,
                // firstName,
                // lastName,
                // description,
                // location,
                // file,
                // userPicturePath,
                // likes,
                // comments,
                _id,
                userPost,
                description,
                file,
                likes,
                comments,
                anniversariesCelebrated,
                status,
              }) => (
                // <PostWidget
                //   key={_id}
                //   postId={_id}
                //   postUserId={userId}
                //   name={`${firstName} ${lastName}`}
                //   description={description}
                //   location={location}
                //   file={file}
                //   userPicturePath={userPicturePath}
                //   likes={likes}
                //   comments={comments}
                //   trashPosts={trashPosts}
                //   detailPost={detailPost}
                // />
                <PostWidget
                  key={_id}
                  postId={_id}
                  statusPost={status}
                  postUserId={userPost?._id}
                  name={`${userPost?.firstName} ${userPost?.lastName}`}
                  description={description}
                  location={userPost?.location}
                  file={file}
                  userPicturePath={userPost?.picturePath}
                  likes={likes}
                  comments={comments}
                  trashPosts={trashPosts}
                  storagePage={storagePage}
                  detailPost={detailPost}
                  isAnniversaryPost={isAnniversaryPost}
                  anniversariesCelebrated={anniversariesCelebrated}
                />
              )
            )
          )}
        </>
      )}
    </>
  );
};

export default PostsWidget;

// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setPosts } from "state";
// import PostWidget from "./PostWidget";

// const PostsWidget = ({ userId, isProfile = false }) => {
//   const dispatch = useDispatch();
//   const posts = useSelector((state) => state.posts);
//   const token = useSelector((state) => state.token);

//   const getPosts = async () => {
//     const response = await fetch("http://localhost:3001/posts", {
//       method: "GET",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await response.json();
//     dispatch(setPosts({ posts: data }));
//   };

//   const getUserPosts = async () => {
//     const response = await fetch(
//       `http://localhost:3001/posts/${userId}/posts`,
//       {
//         method: "GET",
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     const data = await response.json();
//     dispatch(setPosts({ posts: data }));
//   };

//   useEffect(() => {
//     if (isProfile) {
//       getUserPosts();
//     } else {
//       getPosts();
//     }
//   }, [isProfile, userId]); // Add dependencies for useEffect

//   return (
//     <>
//       {posts.length > 0 &&  // Add conditional rendering
//         posts.map(
//           ({
//             _id,
//             userId,
//             firstName,
//             lastName,
//             description,
//             location,
//             picturePath,
//             userPicturePath,
//             likes,
//             comments,
//           }) => (
//             <PostWidget
//               key={_id}
//               postId={_id}
//               postUserId={userId}
//               name={`${firstName} ${lastName}`}
//               description={description}
//               location={location}
//               picturePath={picturePath}
//               userPicturePath={userPicturePath}
//               likes={likes}
//               comments={comments}
//             />
//           )
//         )}
//     </>
//   );
// };

// export default PostsWidget;
