// components/PostSearch.js
import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Avatar,
} from "@mui/material";

const PostSearch = ({ post }) => {
  return (
    <Card sx={{ marginBottom: 2 }}>
      {post.file && (
        <CardMedia
          component={post.file.fileType === "Image" ? "img" : "video"}
          image={post.file.path}
          alt={post.file.fileName}
          sx={{ height: 200 }}
        />
      )}
      <CardContent>
        <Typography variant="h6">{`${post.firstName} ${post.lastName}`}</Typography>
        <Typography variant="body2" color="textSecondary">
          {post.description}
        </Typography>
        <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
          <Avatar
            src={post.userPicturePath}
            alt={`${post.firstName} ${post.lastName}`}
            sx={{ width: 32, height: 32, marginRight: 8 }}
          />
          <Typography variant="body2">{`Posted on: ${new Date(
            post.createdAt
          ).toLocaleString()}`}</Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostSearch;
