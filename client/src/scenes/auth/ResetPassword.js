import { Stack, Typography, Container, Box } from "@mui/material";
import {  useNavigate } from "react-router-dom";
import React from "react";
import { CaretLeft } from "phosphor-react";
import AuthResetPasswordForm from "./Form/ResetPasswordForm";
import Logo from "components/Logo";

const ResetPassword = () => {
  const navigate = useNavigate();
  return (
    <>
      <Container sx={{ mt: 5 }} maxWidth="sm">
        <Stack spacing={5}>
          <Stack
            sx={{ width: "100%", direction: "column", alignItems: "center" }}
          >
            <Logo/>
          </Stack>
        </Stack>
        <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
          <Typography variant="h3" paragraph>
            Forgot your password?
          </Typography>

          <Typography sx={{ color: "text.secondary", mb: 5 }}>
            Please enter the email address associated with your account and We
            will email you a link to reset your password.
          </Typography>
        </Stack>

        {/* Reset Password Form */}
        <AuthResetPasswordForm />

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

export default ResetPassword;
