import { Stack, Typography, Link, Container, Box } from "@mui/material";
import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AuthLoginForm from "./Form/LoginForm";
import AuthSocial from "./Form/AuthSocial";
import Logo from "../../assets/Images/logo.ico";
const Login = () => {
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
          <Typography variant="h4">Login to ConnectU</Typography>

          <Stack direction="row" spacing={0.5}>
            <Typography variant="body2">New user?</Typography>

            <Box
              sx={{ cursor: "pointer" }}
              onClick={() => {
                navigate(`/register`);
              }}
            >
              <Typography variant="subtitle2">Create an account</Typography>
            </Box>
          </Stack>
        </Stack>
        {/* Form */}
        <AuthLoginForm />
        {/* Social auth */}
        <AuthSocial />
      </Container>
    </>
  );
};

export default Login;
