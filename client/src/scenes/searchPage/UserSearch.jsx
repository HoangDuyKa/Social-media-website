// components/UserSearch.js
import React from "react";
import { Card, Avatar, Typography } from "@mui/material";

const UserSearch = ({ user }) => {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        padding: 2,
        marginBottom: 2,
      }}
    >
      <Avatar
        src={user.picturePath}
        alt={`${user.firstName} ${user.lastName}`}
        sx={{ width: 56, height: 56, marginRight: 2 }}
      />
      <div>
        <Typography variant="h6">{`${user.firstName} ${user.lastName}`}</Typography>
        <Typography variant="body2">{`User ID: ${user._id}`}</Typography>
      </div>
    </Card>
  );
};

export default UserSearch;
