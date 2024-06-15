import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "Redux/Slice/app";
import PostWidget from "./PostWidget";
import { Stack, Typography } from "@mui/material";
import { toast } from "sonner";

const PostsWidget = ({
  userId,
  isProfile = false,
  trashPosts = false,
  storagePage = false,
  detailPost = false,
  memoryPage = false,
  isAnniversaryPost = false,
  postId,
}) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.app.posts);
  const token = useSelector((state) => state.auth.token);

  const apiUrl = process.env.REACT_APP_API_URL;

  const getPosts = async () => {
    try {
      const response = await fetch(`${apiUrl}/posts`, {
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
    }
  };

  useEffect(() => {
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
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
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
