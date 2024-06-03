import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import { CommentProvider } from "commentContext";
import Core from "components/CommentSection/Core";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
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
}) => {
  const [isComments, setIsComments] = useState(false);
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

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const patchComment = async (commentText) => {
    const response = await fetch(
      `http://localhost:3001/posts/${postId}/comment`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentText,
          UserComment: loggedInUser,
        }),
      }
    );
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  return (
    <WidgetWrapper m={trashPosts ? "0 0 2rem" : "2rem 0"}>
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

      {file.fileType === "Image" && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={file.path}
        />
      )}

      {file.fileType === "Video" && (
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

      {file.fileType === "File" && (
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
                  height="1000"
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

      {file.fileType === "Audio" && (
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
          {/* <Divider /> */}
          <CommentProvider>
            <Core patchComment={patchComment} postId={postId} />
          </CommentProvider>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
