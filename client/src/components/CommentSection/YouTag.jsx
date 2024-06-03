import { Chip, ThemeProvider, createTheme } from "@mui/material";
import React, { useMemo } from "react";
// import theme from "../styles";
import { themeSettings } from "../../theme";
import { useSelector } from "react-redux";

const YouTag = () => {
  const mode = useSelector((state) => state.app.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <Chip
        label="you"
        variant="filled"
        size="small"
        sx={{
          bgcolor: "custom.moderateBlue",
          color: "neutral.white",
          fontWeight: 500,
          borderRadius: "5px",
        }}
      />
    </ThemeProvider>
  );
};

export default YouTag;
