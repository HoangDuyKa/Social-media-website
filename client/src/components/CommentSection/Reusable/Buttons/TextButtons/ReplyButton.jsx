import { Button } from "@mui/material";
import replyArrow from "assets/Images/icon-reply.svg";

const ReplyButton = ({ functionality }) => {
  return (
    <Button
      startIcon={<img src={replyArrow} alt="reply icon" />}
      sx={{
        color: "custom.moderateBlue",
        fontWeight: 500,
        textTransform: "capitalize",
      }}
      onClick={() => {
        functionality();
      }}
    ></Button>
  );
};

export default ReplyButton;
