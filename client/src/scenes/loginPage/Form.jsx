import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { toast } from "sonner";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "Redux/Slice/auth";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";

const registerSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("required")
    .min(3, "Must be 3 characters or more"),
  lastName: yup
    .string()
    .required("required")
    .min(3, "Must be 3 characters or more"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("required"),
  // .matches(
  //   /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  //   "please enter a valid email address"
  // ),
  password: yup.string().required("required"),
  // .matches(
  //   // password validation regex to show more
  //   /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
  //   "Minimum eight characters, at least one letter, one number and one special character"
  // ),
  // confirmPassword: yup.string().required("required").oneOf([yup.ref("password"),null],"Password must match")
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  // picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const verifySchema = yup.object().shape({
  // code1: yup.string().required("Code is required"),
  // code2: yup.string().required("Code is required"),
  // code3: yup.string().required("Code is required"),
  // code4: yup.string().required("Code is required"),
  // code5: yup.string().required("Code is required"),
  // code6: yup.string().required("Code is required"),
  otp: yup.string().required("Code is required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const initialValuesVerify = {
  // code1: "",
  // code2: "",
  // code3: "",
  // code4: "",
  // code5: "",
  // code6: "",
  otp: "",
};
const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const isVerify = pageType === "verify";
  const [email, setEmail] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;

  const register = async (values, onSubmitProps) => {
    // this allows us to send form info with image
    try {
      const formData = new FormData();
      formData.append("fileType", "Image");
      for (let value in values) {
        formData.append(value, values[value]);
      }
      // formData.append("picturePath", values.picture.name);

      const savedUserResponse = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        body: formData,
      });
      const savedUser = await savedUserResponse.json();
      if (savedUser.error) {
        throw new Error(savedUser.error);
      }
      onSubmitProps.resetForm();

      if (savedUser) {
        // toast.success("Register Successful");
        // setPageType("login");
        setEmail(values["email"]);
        toast.info("Go to your mail to get the OTP and provide below");
        setPageType("verify");
        // navigate(`/verify/${savedUser._id}`);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const login = async (values, onSubmitProps) => {
    try {
      const loggedInResponse = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const loggedIn = await loggedInResponse.json();
      onSubmitProps.resetForm();
      if (loggedIn.error) {
        throw new Error(loggedIn.error);
      }
      if (loggedIn) {
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );
        window.localStorage.setItem("user_id", loggedIn.user._id);
        toast.success("Login Successful");

        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const verify = async (values, onSubmitProps) => {
    try {
      const savedUserResponse = await fetch(`${apiUrl}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otp: values["otp"],
          email,
        }),
      });
      const savedUser = await savedUserResponse.json();
      if (savedUser.error) {
        throw new Error(savedUser.error);
      }
      onSubmitProps.resetForm();

      if (savedUser) {
        toast.success("Register Successful");
        setPageType("login");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
    if (isVerify) await verify(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={
        isLogin
          ? initialValuesLogin
          : isVerify
          ? initialValuesVerify
          : initialValuesRegister
      }
      validationSchema={
        isLogin ? loginSchema : isVerify ? verifySchema : registerSchema
      }
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Location"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location}
                  name="location"
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Occupation"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.occupation}
                  name="occupation"
                  error={
                    Boolean(touched.occupation) && Boolean(errors.occupation)
                  }
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: "span 4" }}
                />
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    accept={{ "image/*": [] }}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}

            {isLogin || isRegister ? (
              <>
                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
              </>
            ) : (
              <>
                <TextField
                  type="text"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.otp}
                  name="otp"
                  error={Boolean(touched.otp) && Boolean(errors.otp)}
                  helperText={touched.otp && errors.otp}
                  sx={{ gridColumn: "span 4" }}
                />
                {/* <TextField
                  type="text"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.code1}
                  name="code1"
                  error={Boolean(touched.code1) && Boolean(errors.code1)}
                  helperText={touched.code1 && errors.code1}
                  sx={{ gridColumn: "span 1" }}
                />
                <TextField
                  type="text"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.code2}
                  name="code2"
                  error={Boolean(touched.code2) && Boolean(errors.code2)}
                  helperText={touched.code2 && errors.code2}
                  sx={{ gridColumn: "span 1" }}
                />
                <TextField
                  type="text"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.code3}
                  name="code3"
                  error={Boolean(touched.code3) && Boolean(errors.code3)}
                  helperText={touched.code3 && errors.code3}
                  sx={{ gridColumn: "span 1" }}
                />
                <TextField
                  type="text"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.code4}
                  name="code4"
                  error={Boolean(touched.code4) && Boolean(errors.code4)}
                  helperText={touched.code4 && errors.code4}
                  sx={{ gridColumn: "span 1" }}
                />
                <TextField
                  type="text"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.code5}
                  name="code5"
                  error={Boolean(touched.code5) && Boolean(errors.code5)}
                  helperText={touched.code5 && errors.code5}
                  sx={{ gridColumn: "span 1" }}
                />
                <TextField
                  type="text"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.code6}
                  name="code6"
                  error={Boolean(touched.code6) && Boolean(errors.code6)}
                  helperText={touched.code6 && errors.code6}
                  sx={{ gridColumn: "span 1" }}
                /> */}
              </>
            )}
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin ? "LOGIN" : isVerify ? "VERIFY" : "REGISTER"}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
