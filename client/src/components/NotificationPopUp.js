// import React, { useEffect, useState } from "react";
// import {
//   Snackbar,
//   Avatar,
//   Typography,
//   IconButton,
//   Box,
//   Paper,
//   useTheme,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

// const NotificationPopup = ({ notification }) => {
//   const [open, setOpen] = useState(true);
//   const palette = useTheme();

//   useEffect(() => {
//     const timer = setTimeout(() => setOpen(false), 5000); // Close after 15 seconds
//     return () => clearTimeout(timer);
//   }, []);

//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//     <Snackbar
//       open={open}
//       onClose={handleClose}
//       anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//       autoHideDuration={5000}
//       sx={{
//         "&:hover": {
//           cursor: "pointer",
//           color: palette.primary,
//         },
//       }}
//       message={
//         <Paper
//           elevation={3}
//           sx={{
//             padding: 2,
//             display: "flex",
//             alignItems: "center",
//             backgroundColor: "#f5f5f5",
//             borderRadius: 2,
//           }}
//         >
//           <Avatar
//             src={notification.userSender.picturePath}
//             alt="User"
//             sx={{ width: 56, height: 56, marginRight: 2 }}
//           />
//           <Box>
//             <Typography variant="subtitle1" fontWeight="bold">
//               {notification.message}
//             </Typography>
//             <Typography variant="body2" color="textSecondary">
//               {new Date(notification.createdAt).toLocaleString()}
//             </Typography>
//           </Box>
//           <IconButton
//             size="small"
//             onClick={handleClose}
//             sx={{ marginLeft: "auto" }}
//           >
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         </Paper>
//       }
//     />
//   );
// };

// export default NotificationPopup;

import React, { useEffect, useState } from "react";
import {
  Snackbar,
  Avatar,
  Typography,
  IconButton,
  Box,
  Paper,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const NotificationPopup = ({ notification }) => {
  const [open, setOpen] = useState(true);
  const palette = useTheme();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Avatar
        src={notification.userSender.picturePath}
        alt="User"
        sx={{ width: 56, height: 56, marginRight: 2 }}
      />
      <Box>
        <Typography variant="subtitle1" fontWeight="bold">
          {notification.message}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {new Date(notification.createdAt).toLocaleString()}
        </Typography>
      </Box>
      {/* <IconButton
        size="small"
        onClick={handleClose}
        sx={{ marginLeft: "auto" }}
      >
        <CloseIcon fontSize="small" />
      </IconButton> */}
    </>
  );
};

export default NotificationPopup;
