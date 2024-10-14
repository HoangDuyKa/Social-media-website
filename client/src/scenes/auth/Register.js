import React from "react";
import {  useNavigate } from "react-router-dom";
// @mui
import { Stack, Typography, Link, Container, Box } from "@mui/material";
import AuthRegisterForm from "./Form/RegisterForm";
import AuthSocial from "./Form/AuthSocial";
import Logo from "components/Logo";

// ----------------------------------------------------------------------

export default function Register() {
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
          <Typography variant="h4">Get started with ConnectU.</Typography>

          <Stack direction="row" spacing={0.5}>
            <Typography variant="body2"> Already have an account? </Typography>

            <Box
              sx={{ cursor: "pointer" }}
              onClick={() => {
                navigate(`/login`);
              }}
            >
              <Typography variant="subtitle2">Sign in</Typography>
            </Box>
          </Stack>
        </Stack>
        {/* Form */}
        <AuthRegisterForm />

        <Typography
          component="div"
          sx={{
            color: "text.secondary",
            mt: 3,
            typography: "caption",
            textAlign: "center",
          }}
        >
          {"By signing up, I agree to "}
          <Link underline="always" color="text.primary">
            Terms of Service
          </Link>
          {" and "}
          <Link underline="always" color="text.primary">
            Privacy Policy
          </Link>
          .
        </Typography>

        <AuthSocial />
      </Container>
    </>
  );
}
