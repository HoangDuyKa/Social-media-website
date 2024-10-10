import { useState } from "react";
import * as Yup from "yup";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { Stack, IconButton, InputAdornment, Button } from "@mui/material";
// components
import FormProvider, { RHFTextField } from "../../../components/hook-form";
import { Eye, EyeSlash } from "phosphor-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

// ----------------------------------------------------------------------

export default function NewPasswordForm() {
  const navigate = useNavigate();
  const [queryParameters] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  console.log(queryParameters);

  const VerifyCodeSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    passwordConfirm: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const defaultValues = {
    password: "",
    passwordConfirm: "",
  };

  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(VerifyCodeSchema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  const onSubmit = async (values) => {
    try {
      //   Send API Request
      // dispatch(NewPassword({ ...data, token: queryParameters.get("token") }));
      const { password, passwordConfirm } = values;
      const userInResponse = await fetch(`${apiUrl}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify(values),
        // token: queryParameters.get("token"),
        body: JSON.stringify({
          password,
          passwordConfirm,
          token: queryParameters.get("token"),
        }),
      });
      const userForget = await userInResponse.json();
      console.log(userForget);
      if (userForget.error) {
        throw new Error(userForget.error);
      }
      if (userForget.status === "success") {
        toast.success(userForget.message);
        navigate("/login");
      } else {
        toast.error(userForget.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <Eye /> : <EyeSlash />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <RHFTextField
          name="passwordConfirm"
          label="Confirm New Password"
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <Eye /> : <EyeSlash />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
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
          Update Password
        </Button>
      </Stack>
    </FormProvider>
  );
}
