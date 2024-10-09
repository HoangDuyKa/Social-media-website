import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PostIcon from "@mui/icons-material/Article";
import UserIcon from "@mui/icons-material/People";
import { Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
const Sidebar = ({ setActivePage, activePage }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const primaryLight = theme.palette.primary.light;
  return (
    <>
      <Drawer variant="permanent">
        <List>
          <ListItem style={{ display: "flex", justifyContent: "center" }}>
            <Typography
              fontWeight="bold"
              fontSize="clamp(1rem, 2rem, 2.25rem)"
              color="primary"
              onClick={() => navigate("/")}
              sx={{
                "&:hover": {
                  color: primaryLight,
                  cursor: "pointer",
                },
              }}
            >
              ConnectU
            </Typography>
          </ListItem>
          <ListItem
            button
            sx={{
              backgroundColor: activePage === "dashboard" ? "#e6e3e3" : "#fff",
              "&:hover": {
                backgroundColor: "#e6e3e3",
              },
            }}
            onClick={() => setActivePage("dashboard")}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem
            sx={{
              backgroundColor: activePage === "posts" ? "#e6e3e3" : "#fff",
              "&:hover": {
                backgroundColor: "#e6e3e3",
              },
            }}
            button
            onClick={() => setActivePage("posts")}
          >
            <ListItemIcon>
              <PostIcon />
            </ListItemIcon>
            <ListItemText primary="Posts Management" />
          </ListItem>
          <ListItem
            sx={{
              backgroundColor: activePage === "users" ? "#e6e3e3" : "#fff",
              "&:hover": {
                backgroundColor: "#e6e3e3",
              },
            }}
            button
            onClick={() => setActivePage("users")}
          >
            <ListItemIcon>
              <UserIcon />
            </ListItemIcon>
            <ListItemText primary="Users Management" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
