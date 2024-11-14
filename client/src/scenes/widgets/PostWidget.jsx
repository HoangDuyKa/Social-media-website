import {
  ChatBubbleOutlineOutlined,
  Check,
  Close,
  Delete,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  Undo,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import CoreComment from "components/CommentSection/Core";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "Redux/Slice/app";
import _ from "lodash";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
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
  storagePage,
  isAnniversaryPost,
  anniversariesCelebrated,
  statusPost,
  createdAt,
}) => {
  const [isComments, setIsComments] = useState(detailPost);
  const [isPreviewPDF, SetIsPreviewPDF] = useState(false);
  const [editingPost, setEditingPost] = useState(false);
  const [descriptionText, setDescriptionText] = useState(description);
  const [fileEdit, setFileEdit] = useState(file);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const loggedInUser = useSelector((state) => state.auth.user);
  const loggedInUserId = loggedInUser._id;
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  // const time = "12 hours ago";
  // const [isDeletedFile, setIsDeletedFile] = useState(false);

  const [isDeletedFile, setIsDeletedFile] = useState(false);

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const apiUrl = process.env.REACT_APP_API_URL;
  const handleDeleteFile = () => {
    setIsDeletedFile(true);
    setFileEdit(null);
  };

  const handleUndoDeleteFile = () => {
    setIsDeletedFile(false);
    setFileEdit(file);
  };

  const handleFileUpload = (newFile) => {
    setFileEdit(newFile);
  };

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

  const editPost = async () => {
    try {
      const formData = new FormData();

      formData.append("description", descriptionText);
      formData.append("isDeletedFile", isDeletedFile);
      // check if any file changed and file not null
      if (!_.isEqual(file, fileEdit) && fileEdit !== null) {
        let fileTypeEdit;
        if (fileEdit.type.includes("image/")) {
          fileTypeEdit = "Image";
        } else if (fileEdit.type.includes("video/")) {
          fileTypeEdit = "Video";
        } else if (fileEdit.type.includes("audio/")) {
          fileTypeEdit = "Audio";
        } else {
          fileTypeEdit = "File";
        }
        formData.append("file", fileEdit);
        formData.append("fileType", fileTypeEdit);
        formData.append("fileName", fileEdit.name);
      }

      const response = await fetch(`${apiUrl}/posts/${postId}/edit`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // body: JSON.stringify({
        //   description: descriptionText,
        // }),
        body: formData,
      });
      const data = await response.json();
      setFileEdit(data.post.file);
      dispatch(setPost({ post: data.post }));
      if (!_.isEqual(file, fileEdit) || description !== descriptionText) {
        toast.success(data.message);
      } else {
        toast.info("Nothing to change");
      }
      if (data.error) throw new Error(data.error);
      dispatch(setPost({ post: data }));
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
          userComment: loggedInUser._id,
        }),
      });
      const updatedPost = await response.json();
      console.log(updatedPost);
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
      const response = await fetch(`${apiUrl}/posts/${postId}/editComment`, {
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
      console.log(updatedPost);
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
          userReplyComment: loggedInUser._id,
        }),
      });
      const updatedPost = await response.json();
      console.log(updatedPost);
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
      {isAnniversaryPost && (
        <Stack
          sx={{
            backgroundColor: palette.primary.light,
            color: palette.primary.contrastText,
            padding: "1rem",
            borderRadius: "0.75rem",
            marginBottom: "1rem",
            direction: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography fontWeight="500" variant="h3">
            Celebrating the {anniversariesCelebrated} year anniversary!
          </Typography>
        </Stack>
      )}
      <Friend
        friendId={postUserId}
        name={name}
        // subtitle={location}
        // subtitle={time}
        subtitle={dayjs(createdAt).fromNow()}
        userPicturePath={userPicturePath}
        // isPost={true}
        postUserId={postUserId}
        postId={postId}
        trashPosts={trashPosts}
        storagePage={storagePage}
        isAnniversaryPost={isAnniversaryPost}
        statusPost={statusPost}
        editingPost={editingPost}
        setEditingPost={setEditingPost}
      />

      {editingPost ? (
        <>
          <TextField
            variant="outlined"
            fullWidth
            value={descriptionText}
            onChange={(e) => setDescriptionText(e.target.value)}
            placeholder={"Please enter your description"}
            multiline
            maxRows={4}
            sx={{ ml: 2, mr: 2 }}
            InputProps={{
              sx: {
                borderRadius: 2,
              },
            }}
          />
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <IconButton size="small" onClick={() => setEditingPost(false)}>
              <Close fontSize="small" />
            </IconButton>
            <IconButton
              sx={{
                float: "right",
                borderRadius: "3rem",
                marginLeft: 1,
                p: "4px 16px",
              }}
              onClick={() => {
                editPost(descriptionText);
                setEditingPost(!editingPost);
              }}
            >
              <Check fontSize="small" />
            </IconButton>
          </Stack>

          {(fileEdit === null || fileEdit?.path === "noFile") && (
            <input
              type="file"
              accept="image/*,video/*,audio/*,application/pdf" // Specify allowed file types
              onChange={(e) => handleFileUpload(e.target.files[0])}
            />
          )}
        </>
      ) : (
        <Typography color={main} sx={{ mt: "1rem" }}>
          {description}
        </Typography>
      )}

      {fileEdit?.fileType === "Image" && (
        <div>
          <img
            width="100%"
            height="auto"
            alt="post"
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
            src={fileEdit.path}
          />
          {/* {editingPost && (
            <IconButton onClick={handleDeleteFile}>
              <Delete />
            </IconButton>
          )} */}
        </div>
      )}

      {fileEdit?.fileType === "Video" && (
        <div>
          <video
            width="100%"
            height="auto"
            alt="post"
            controls
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          >
            <source src={fileEdit.path}></source>
          </video>
          {/* {editingPost && (
            <IconButton onClick={handleDeleteFile}>
              <Delete />
            </IconButton>
          )} */}
        </div>
      )}

      {fileEdit?.fileType === "File" && (
        <div>
          {/* <h3>Document Preview</h3> */}
          <a
            href={fileEdit.path}
            target="_blank"
            // download={file.fileName}
            rel="noopener noreferrer"
          >
            Open Document{" "}
          </a>
          {fileEdit.fileName}
          <br />
          {/* <a href={file.path} download={file.fileName}>
            Download Document
          </a> */}
          {fileEdit.path.endsWith(".pdf") && (
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
              {/* {editingPost && (
                <IconButton onClick={handleDeleteFile}>
                  <Delete />
                </IconButton>
              )} */}
              {isPreviewPDF && (
                <iframe
                  src={fileEdit.path}
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

      {fileEdit?.fileType === "Audio" && (
        <div>
          <audio controls>
            <source src={fileEdit.path} />
          </audio>
        </div>
      )}
      {editingPost && !isDeletedFile && fileEdit.path !== "noFile" && (
        <IconButton onClick={handleDeleteFile}>
          <Delete />
        </IconButton>
      )}

      {editingPost && isDeletedFile && (
        <IconButton onClick={handleUndoDeleteFile}>
          <Undo />
        </IconButton>
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
