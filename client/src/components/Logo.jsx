import { Typography, useTheme } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Logo = () => {
    const navigate = useNavigate();
    const theme = useTheme();
  const primaryLight = theme.palette.primary.light;

    return (
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
    )
}

export default Logo
