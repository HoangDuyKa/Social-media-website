import { Stack, Typography, Link, Container, Box } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import React from "react";
import { CaretLeft } from "phosphor-react";
import NewPasswordForm from "./Form/NewPasswordForm";
import Logo from "../../assets/Images/logo.ico";

const NewPassword = () => {
  const navigate = useNavigate();
  return (
    <>
      <Container sx={{ mt: 5 }} maxWidth="sm">
        <Stack spacing={5}>
          <Stack
            sx={{ width: "100%", direction: "column", alignItems: "center" }}
          >
            <img style={{ width: 200 }} src={Logo} alt="Logo" />
          </Stack>
        </Stack>
        <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
          <Typography variant="h3" paragraph>
            Reset Password
          </Typography>

          <Typography sx={{ color: "text.secondary", mb: 5 }}>
            Please set your new password.
          </Typography>
        </Stack>

        {/* NewPasswordForm */}

        <NewPasswordForm />

        <Box
          sx={{ cursor: "pointer" }}
          onClick={() => {
            navigate(`/login`);
          }}
        >
          <Typography
            color="inherit"
            variant="subtitle2"
            sx={{
              mt: 3,
              mx: "auto",
              alignItems: "center",
              display: "inline-flex",
            }}
          >
            <CaretLeft size={24} />
            Return to sign in
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default NewPassword;
