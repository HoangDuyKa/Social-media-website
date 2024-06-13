import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  // MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import toast from "react-hot-toast";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "Redux/Slice/app";

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  // const [isImage, setIsImage] = useState(false);
  // const [image, setImage] = useState(null);
  // const [isVideo, setIsVideo] = useState(false);
  // const [video, setVideo] = useState(null);
  // const [isFile, setIsFile] = useState(false);
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState("");
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleFileTypeChange = (type) => {
    setFileType(type);
    setFile(null); // Clear the selected file when changing the type
  };

  const handlePost = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("description", post);
      if (file) {
        formData.append("file", file);
        formData.append("fileType", fileType);
        formData.append("fileName", file.name);
      }
      // if (image) {
      //   formData.append("image", image);
      // } else if (video) {
      //   formData.append("video", video);
      // } else if (file) {
      //   formData.append("file", file);
      // }
      // console.log("image", image);
      // console.log("video", video);
      // console.log("file", file);

      const response = await fetch(`${apiUrl}/posts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const posts = await response.json();
      if (posts.error) {
        throw new Error(posts.error);
      }
      // console.log(posts);
      dispatch(setPosts({ posts }));
      // setImage(null);
      // setVideo(null);
      // setIsImage(false);
      // setIsVideo(false);
      setFileType("");
      setFile(null);
      setPost("");
      setIsLoading(false);
      toast.success("Post was Successfully");
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <WidgetWrapper sx={{ m: "0 0 1rem" }}>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>
      {/* {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
            accept={{ "image/*": [] }}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Add Image Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{image.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton
                    onClick={() => setImage(null)}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      {isVideo && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".mp4,.mov,.avi,.mpeg4,.flv,.3gpp"
            multiple={false}
            onDrop={(acceptedFiles) => setVideo(acceptedFiles[0])}
            // accept={function (file, done) {
            //   var ext = file.name.split(".")[1]; // get extension from file name
            //   if (ext === "mp4" || ext === "mov") {
            //     done("Dont like those extension"); // error message for user
            //   } else {
            //     done();
            //   } // accept file
            // }}
            // accept={{
            //   "audio/mpeg": [".mp3"],
            //   "audio/wav": [".wav"],
            //   "audio/webm": [".webm"],
            //   "audio/flac": [".flac"],
            //   "audio/x-m4a": [".m4a"],

            //   "video/mp4": [".mp4"],
            //   "video/mpeg": [".mpeg"],
            //   "video/webm": [".webm"],
            // }}
            accept={{ "video/*": [] }}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!video ? (
                    <p>Add Video Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{video.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {video && (
                  <IconButton
                    onClick={() => setVideo(null)}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )} */}

      {/* {isFile && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            // acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => setFile(acceptedFiles[0])}
            accept={".pdf,.doc,.docx,.txt"}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!file ? (
                    <p>Add File Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{file.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {file && (
                  <IconButton
                    onClick={() => setFile(null)}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )} */}

      {fileType && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            // acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            loading
            onDrop={(acceptedFiles) => setFile(acceptedFiles[0])}
            // accept={{ "*/*": [] }}
            // accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain"
            accept={
              fileType === "Image"
                ? { "image/*": [] }
                : fileType === "Video"
                ? { "video/*": [] }
                : fileType === "Audio"
                ? { "audio/*": [] }
                : {
                    "text/*": [],
                    "application/pdf": [],
                    "application/msword": [],
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                      [],
                  }
            }
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!file ? (
                    <p>Add {fileType} Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{file.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {file && (
                  <IconButton
                    onClick={() => setFile(null)}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}
      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        {isNonMobileScreens ? (
          <>
            <FlexBetween
              gap="0.25rem"
              onClick={() =>
                // fileType === ""
                //   ? handleFileTypeChange("Image")
                //   : setFileType("")
                fileType === "Image"
                  ? setFileType("")
                  : handleFileTypeChange("Image")
              }
            >
              {/* <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}> */}
              <ImageOutlined sx={{ cursor: "pointer", color: mediumMain }} />
              <Typography
                color={mediumMain}
                sx={{ "&:hover": { cursor: "pointer", color: medium } }}
              >
                Image
              </Typography>
            </FlexBetween>
            <FlexBetween
              gap="0.25rem"
              onClick={() =>
                // fileType === ""
                //   ? handleFileTypeChange("Video")
                //   : setFileType("")
                fileType === "Video"
                  ? setFileType("")
                  : handleFileTypeChange("Video")
              }
            >
              {/* <FlexBetween gap="0.25rem" onClick={() => setIsVideo(!isVideo)}> */}
              <GifBoxOutlined sx={{ cursor: "pointer", color: mediumMain }} />
              <Typography
                color={mediumMain}
                sx={{ "&:hover": { cursor: "pointer", color: medium } }}
              >
                Clip
              </Typography>
            </FlexBetween>

            <FlexBetween
              gap="0.25rem"
              onClick={() =>
                // fileType === "" ? handleFileTypeChange("File") : setFileType("")
                fileType === "File"
                  ? setFileType("")
                  : handleFileTypeChange("File")
              }
            >
              {/* <FlexBetween gap="0.25rem" onClick={() => setIsFile(!isFile)}> */}
              <AttachFileOutlined
                sx={{ cursor: "pointer", color: mediumMain }}
              />
              <Typography
                color={mediumMain}
                sx={{ "&:hover": { cursor: "pointer", color: medium } }}
              >
                Attachment
              </Typography>
            </FlexBetween>

            <FlexBetween
              gap="0.25rem"
              onClick={() =>
                // fileType === ""
                //   ? handleFileTypeChange("Audio")
                //   : setFileType("")
                fileType === "Audio"
                  ? setFileType("")
                  : handleFileTypeChange("Audio")
              }
            >
              <MicOutlined sx={{ cursor: "pointer", color: mediumMain }} />
              <Typography
                color={mediumMain}
                sx={{ "&:hover": { cursor: "pointer", color: medium } }}
              >
                Audio
              </Typography>
            </FlexBetween>
          </>
        ) : (
          <>
            {/* <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}> */}
            <FlexBetween
              gap="0.25rem"
              onClick={() =>
                fileType === "Image"
                  ? setFileType("")
                  : handleFileTypeChange("Image")
              }
            >
              <ImageOutlined sx={{ color: mediumMain }} />
            </FlexBetween>
            <FlexBetween
              gap="0.25rem"
              onClick={() =>
                fileType === "Video"
                  ? setFileType("")
                  : handleFileTypeChange("Video")
              }
            >
              <GifBoxOutlined sx={{ color: mediumMain }} />
            </FlexBetween>

            <FlexBetween
              gap="0.25rem"
              onClick={() =>
                fileType === "File"
                  ? setFileType("")
                  : handleFileTypeChange("File")
              }
            >
              <AttachFileOutlined sx={{ color: mediumMain }} />
            </FlexBetween>

            <FlexBetween
              gap="0.25rem"
              onClick={() =>
                fileType === "Audio"
                  ? setFileType("")
                  : handleFileTypeChange("Audio")
              }
            >
              <MicOutlined sx={{ color: mediumMain }} />
            </FlexBetween>
          </>
        )}

        {isLoading ? (
          <Button
            disabled
            sx={{
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
            }}
          >
            Loading...
          </Button>
        ) : (
          <Button
            disabled={!post}
            onClick={handlePost}
            sx={{
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
            }}
          >
            POST
          </Button>
        )}
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
