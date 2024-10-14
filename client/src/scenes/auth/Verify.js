// sections
import { Stack, Typography, Container } from "@mui/material";
import VerifyForm from "./Form/VerifyForm";
import Logo from "components/Logo";
import { useLocation } from "react-router-dom";

// ----------------------------------------------------------------------

export default function VerifyPage() {

  // const [queryParameters] = useSearchParams();
  // console.log(queryParameters)

  const location = useLocation();
  const { email } = location.state || {}; // Access the state passed from Page 1
  console.log(location.state)


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
          <Typography variant="h4">Please Verify OTP</Typography>

          <Stack direction="row" spacing={0.5}>
            <Typography variant="body2">
              Sent to email {email}
            </Typography>
          </Stack>
        </Stack>
        {/* Form */}
        <VerifyForm />
      </Container>
    </>
  );
}
