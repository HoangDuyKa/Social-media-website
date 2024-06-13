import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import CoreComment from "components/CommentSection/Core";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "Redux/Slice/app";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  file,
  userPicturePath,
  likes,
  comments,
  trashPosts,
  detailPost,
}) => {
  const [isComments, setIsComments] = useState(detailPost);
  const [isPreviewPDF, SetIsPreviewPDF] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const loggedInUser = useSelector((state) => state.auth.user);
  const loggedInUserId = loggedInUser._id;
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const time = "12 hours ago";

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const apiUrl = process.env.REACT_APP_API_URL;

  const patchLike = async () => {
    try {
      const response = await fetch(`${apiUrl}/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId, postUserId }),
      });
      const updatedPost = await response.json();
      if (updatedPost.error) throw new Error(updatedPost.error);

      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const patchComment = async (commentText) => {
    try {
      const response = await fetch(`${apiUrl}/posts/${postId}/comment`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentText,
          UserComment: loggedInUser,
        }),
      });
      const updatedPost = await response.json();
      if (updatedPost.error) throw new Error(updatedPost.error);

      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const response = await fetch(`${apiUrl}/posts/${postId}/deleteComment`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId,
        }),
      });
      const updatedPost = await response.json();
      if (updatedPost.error) throw new Error(updatedPost.error);

      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const editComment = async (commentId, newComment) => {
    try {
      const response = await fetch(`${apiUrl}/${postId}/editComment`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId,
          newComment,
        }),
      });
      const updatedPost = await response.json();
      if (updatedPost.error) throw new Error(updatedPost.error);

      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const patchReplyComment = async (
    replyCommentText,
    replyCommentId,
    replyingTo
  ) => {
    try {
      const response = await fetch(`${apiUrl}/posts/${postId}/replyComment`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          replyCommentText,
          replyCommentId,
          replyingTo,
          UserReplyComment: loggedInUser,
        }),
      });
      const updatedPost = await response.json();
      if (updatedPost.error) throw new Error(updatedPost.error);
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  // const deleteReplyComment = async (commentId) => {
  //   const response = await fetch(
  //     `${apiUrl}/posts/${postId}/deleteReplyComment`,
  //     {
  //       method: "PATCH",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         commentId,
  //       }),
  //     }
  //   );
  //   const updatedPost = await response.json();
  //   dispatch(setPost({ post: updatedPost }));
  // };

  // const editReplyComment = async (commentId, newComment) => {
  //   const response = await fetch(`${apiUrl}/posts/${postId}/editReplyComment`, {
  //     method: "PUT",
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       commentId,
  //       newComment,
  //     }),
  //   });
  //   const updatedPost = await response.json();
  //   dispatch(setPost({ post: updatedPost }));
  // };

  return (
    // 1rem 0
    <WidgetWrapper m={"0 0 1rem"}>
      <Friend
        friendId={postUserId}
        name={name}
        // subtitle={location}
        subtitle={time}
        userPicturePath={userPicturePath}
        // isPost={true}
        postUserId={postUserId}
        postId={postId}
        trashPosts={trashPosts}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {/* {picturePath !== "noFile" && picturePath.split(" ")[0] === "image" && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          // src={`http://localhost:3001/assets/${picturePath}`}
          src={picturePath.split(" ")[1]}
        />
      )}
      {picturePath !== "noFile" && picturePath.split(" ")[0] === "video" && (
        <video
          width="100%"
          height="auto"
          alt="post"
          controls
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          // src={`http://localhost:3001/assets/${picturePath}`}
        >
          <source src={picturePath.split(" ")[1]}></source>
        </video>
      )} */}

      {file?.fileType === "Image" && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={file.path}
        />
      )}

      {file?.fileType === "Video" && (
        <video
          width="100%"
          height="auto"
          alt="post"
          controls
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
        >
          <source src={file.path}></source>
        </video>
      )}

      {file?.fileType === "File" && (
        <div>
          {/* <h3>Document Preview</h3> */}
          <a
            href={file.path}
            target="_blank"
            // download={file.fileName}
            rel="noopener noreferrer"
          >
            Open Document{" "}
          </a>
          {file.fileName}
          <br />
          {/* <a href={file.path} download={file.fileName}>
            Download Document
          </a> */}
          {file.path.endsWith(".pdf") && (
            <div>
              {/* <IconButton >
                <ChatBubbleOutlineOutlined sx={{ color: primary }} />
              </IconButton> */}
              <Typography
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                    color: palette.primary.light,
                  },
                  width: "122px",
                }}
                onClick={() => SetIsPreviewPDF(!isPreviewPDF)}
              >
                Preview file here
              </Typography>
              {isPreviewPDF && (
                <iframe
                  src={file.path}
                  // src="https://www.clickdimensions.com/links/TestPDFfile.pdf"
                  // width="840"
                  width={"100%"}
                  height="800px"
                  title="Document Preview"
                ></iframe>
              )}
            </div>
          )}
        </div>
        // <div>
        //   <h3>Document Preview</h3>
        //   <a href={file.path} target="_blank" rel="noopener noreferrer">
        //     Open Document
        //   </a>
        //   <br />
        //   <a href={file.path} download>
        //     Download Document
        //   </a>
        // </div>
      )}

      {file?.fileType === "Audio" && (
        <audio controls>
          <source src={file.path} />
        </audio>
      )}

      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {/* {comments.map((comment, i) => (
            // <Box key={`${name}-${i}`}>
            //   <Divider />
            //   <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
            //     {comment}
            //   </Typography>
            // </Box>
            
          ))} */}
          <Divider sx={{ marginBottom: "1rem" }} />
          <CoreComment
            patchComment={patchComment}
            deleteComment={deleteComment}
            editComment={editComment}
            patchReplyComment={patchReplyComment}
            postId={postId}
            postUserId={postUserId}
            UserCommentImage={loggedInUser.picturePath}
          />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
