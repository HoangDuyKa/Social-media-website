import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// components
import FormProvider, { RHFTextField } from "../../../components/hook-form";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// ----------------------------------------------------------------------

export default function AuthResetPasswordForm() {
  const { isLoading } = useSelector((state) => state.auth);
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
  });

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { email: "" },
  });

  const { handleSubmit } = methods;

  const onSubmit = async (values) => {
    console.log(values);
    try {
      //   Send API Request
      const userInResponse = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const userForget = await userInResponse.json();
      console.log(userForget);
      if (userForget.error) {
        throw new Error(userForget.error);
      }
      if (userForget.status === "success") {
        toast.success(userForget.message);
      } else {
        toast.error(userForget.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <RHFTextField name="email" label="Email address" />

      <LoadingButton
        loading={isLoading}
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        sx={{
          mt: 3,
          bgcolor: "text.primary",
          color: (theme) =>
            theme.palette.mode === "light" ? "common.white" : "grey.800",
          "&:hover": {
            bgcolor: "text.primary",
            color: (theme) =>
              theme.palette.mode === "light" ? "common.white" : "grey.800",
          },
        }}
      >
        Send Request
      </LoadingButton>
    </FormProvider>
  );
}
