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
import RHFCodes from "../../../components/hook-form/RHFCodes";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

// ----------------------------------------------------------------------

export default function VerifyForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email } = useSelector((state) => state.auth);
  const apiUrl = process.env.REACT_APP_API_URL;
  const params = useParams();

  const VerifyCodeSchema = Yup.object().shape({
    code1: Yup.string().required("Code is required"),
    code2: Yup.string().required("Code is required"),
    code3: Yup.string().required("Code is required"),
    code4: Yup.string().required("Code is required"),
    code5: Yup.string().required("Code is required"),
    code6: Yup.string().required("Code is required"),
  });

  const defaultValues = {
    code1: "",
    code2: "",
    code3: "",
    code4: "",
    code5: "",
    code6: "",
  };

  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(VerifyCodeSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async (values) => {
    try {
      //   Send API Request
      // dispatch(
      //   VerifyEmail({
      //     email,
      //     otp: `${data.code1}${data.code2}${data.code3}${data.code4}${data.code5}${data.code6}`,
      //   })
      // );
      const savedUserResponse = await fetch(`${apiUrl}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // otp: values["otp"],
          otp: `${values.code1}${values.code2}${values.code3}${values.code4}${values.code5}${values.code6}`,
          email: params.email,
        }),
      });
      const savedUser = await savedUserResponse.json();
      if (savedUser.error) {
        throw new Error(savedUser.error);
      }
      reset();
      if (savedUser.status === "success") {
        toast.success(savedUser.message);
        // setPageType("login");
        navigate("/login");
      } else if (savedUser.status === "error") {
        toast.error(savedUser.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFCodes
          keyName="code"
          inputs={["code1", "code2", "code3", "code4", "code5", "code6"]}
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
          Verify
        </Button>
      </Stack>
    </FormProvider>
  );
}
