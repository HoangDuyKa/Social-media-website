import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
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
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const loggedInUserId = useSelector((state) => state.auth.user._id);
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

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        // subtitle={location}
        subtitle={time}
        userPicturePath={userPicturePath}
        isPost
        postUserId={postUserId}
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
          <a href={file.path} target="_blank" rel="noopener noreferrer">
            Open Document{" "}
          </a>
          {file.fileName}
          <br />
          <a href={file.path} download>
            Download Document
          </a>
          {file.path.endsWith(".pdf") && (
            <iframe
              src={file.path}
              // src="https://www.clickdimensions.com/links/TestPDFfile.pdf"
              width="600"
              height="400"
              title="Document Preview"
            ></iframe>
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
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment}
              </Typography>
            </Box>
          ))}
          <Divider />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
