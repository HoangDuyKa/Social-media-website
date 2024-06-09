import React from "react";
import {
  Avatar,
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import Dropzone from "react-dropzone";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "Redux/Slice/auth";

const FormEditUser = ({ user, setEditUser }) => {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const token = useSelector((state) => state.auth.token);

  const initialValues = {
    firstName: user.firstName.trim(),
    lastName: user.lastName.trim(),
    email: user.email.trim(),
    password: "",
    newPassword: "",
    confirmNewPassword: "",
    location: user.location.trim(),
    occupation: user.occupation.trim(),
    picture: user.picturePath.trim(),
  };

  const updateUser = async (values, onSubmitProps) => {
    // this allows us to send form info with image
    try {
      const formData = new FormData();
      //   formData.append("fileType", "Image");
      for (let value in values) {
        formData.append(value, values[value]);
      }
      const savedUserResponse = await fetch(
        `http://localhost:3001/users/updateUser/${user._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            // "Content-Type": "multipart/form-data",
          },

          body: formData,
        }
      );
      const savedUser = await savedUserResponse.json();
      console.log(savedUser);
      if (savedUser.error) {
        throw new Error(savedUser.error);
      }

      if (savedUser) {
        dispatch(setUser({ user: savedUser }));
        toast.success("Update Successful");
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleFormSubmit = async (values, onSubmitProps) => {
    if (values["newPassword"] !== values["confirmNewPassword"]) {
      toast.error("Passwords do not match");
    } else {
      await updateUser(values, onSubmitProps);
    }
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
      //   validationSchema={registerSchema}
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
            <>
              <TextField
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={Boolean(touched.firstName) && Boolean(errors.firstName)}
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
                      p={"1rem"}
                      sx={{ "&:hover": { cursor: "pointer" } }}
                    >
                      {/* <FlexBetween>
                        <img
                          style={{ height: 70, marginBottom: 0 }}
                          src={user.picturePath}
                          alt="avatar"
                        />
                        <EditOutlinedIcon />
                      </FlexBetween> */}
                      <input {...getInputProps()} />
                      {values.picture === user.picturePath ? (
                        <p>Change Picture Here</p>
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
            <TextField
              label="NewPassword"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.confirmPassword}
              name="newPassword"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="ConfirmNewPassword"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.confirmPassword}
              name="confirmNewPassword"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
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
              Update
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default FormEditUser;
