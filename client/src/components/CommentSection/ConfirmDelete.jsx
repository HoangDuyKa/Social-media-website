import React from "react";
import {
  Button,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";

const ConfirmDelete = ({ onOpen, onClose, id, deleteComment }) => {
  const handleDeleteComment = async () => {
    // const data = await fetch("")

    deleteComment(id);
    onClose();
  };
  return (
    <Dialog open={onOpen} onClose={onClose}>
      <DialogContent sx={{ maxWidth: "430px" }}>
        <DialogTitle sx={{ p: "0", marginBottom: "20px" }}>
          Delete comment
        </DialogTitle>
        <Typography
          component="p"
          sx={{ marginBottom: "20px", color: "neutral.grayishBlue" }}
        >
          Are you sure you want to delete this comment? This will remove the
          comment and it can't be undone.
        </Typography>
        <Stack direction="row" display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            disableElevation
            sx={{
              bgcolor: "neutral.grayishBlue",
              "&:hover": { bgcolor: "neutral.grayishBlue" },
            }}
            onClick={onClose}
          >
            No, cancel
          </Button>
          <Button
            variant="contained"
            disableElevation
            sx={{
              bgcolor: "custom.softRed",
              "&:hover": { bgcolor: "custom.softRed" },
            }}
            onClick={() => {
              handleDeleteComment();
            }}
          >
            Yes, delete
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDelete;
