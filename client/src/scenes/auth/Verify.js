import { Link as RouterLink } from "react-router-dom";
// sections
import { Stack, Typography, Link, Container } from "@mui/material";
import VerifyForm from "./Form/VerifyForm";
import Logo from "../../assets/Images/logo.ico";

// ----------------------------------------------------------------------

export default function LoginPage() {
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
          <Typography variant="h4">Please Verify OTP</Typography>

          <Stack direction="row" spacing={0.5}>
            <Typography variant="body2">
              Sent to email (shreyanshshah242@gmail.com)
            </Typography>
          </Stack>
        </Stack>
        {/* Form */}
        <VerifyForm />
      </Container>
    </>
  );
}
