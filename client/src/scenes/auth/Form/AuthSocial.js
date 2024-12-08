// @mui
import { Divider, IconButton, Stack } from "@mui/material";
import { GithubLogo, GoogleLogo, TwitterLogo } from "phosphor-react";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  TwitterAuthProvider,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom/dist";
import { useDispatch } from "react-redux";
import { setLogin } from "Redux/Slice/auth";
import { toast } from "sonner";

// // Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuYUhDSdjy_Neb-d2JJI5RE5oXApBdLLI",
  authDomain: "social-media-website-571e4.firebaseapp.com",
  projectId: "social-media-website-571e4",
  storageBucket: "social-media-website-571e4.firebasestorage.app",
  messagingSenderId: "529389678855",
  appId: "1:529389678855:web:29a23941a8cd857325d5a2",
  measurementId: "G-SN9CV6H3TT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ----------------------------------------------------------------------

export default function AuthSocial() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const apiUrl = process.env.REACT_APP_API_URL;
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    try {
      const result = await signInWithPopup(auth, provider);
      const { user } = result;
      console.log(user);

      // Send the user token to your backend for verification
      // const googleToken = await user.getIdToken();
      // console.log(googleToken);

      const response = await fetch(`${apiUrl}/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user }),
      });

      const loggedIn = await response.json();
      console.log(loggedIn);

      if (loggedIn.error) {
        throw new Error(loggedIn.error);
      }

      // Save the user in Redux and localStorage
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      window.localStorage.setItem("user_id", loggedIn.user._id);
      toast.success("Google Login Successful");

      navigate("/");
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error(error.message);
    }
  };

  const handleGithubLogin = async () => {
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("GitHub login successful:", user);
    } catch (error) {
      console.error("GitHub login error:", error);
    }
  };

  const handleTwitterLogin = async () => {
    const provider = new TwitterAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Twitter login successful:", user);
    } catch (error) {
      console.error("Twitter login error:", error);
    }
  };

  return (
    <div>
      <Divider
        sx={{
          my: 2.5,
          typography: "overline",
          color: "text.disabled",
          "&::before, ::after": {
            borderTopStyle: "dashed",
          },
        }}
      >
        OR
      </Divider>

      <Stack direction="row" justifyContent="center" spacing={2}>
        <IconButton onClick={handleGoogleLogin}>
          <GoogleLogo color="#DF3E30" />
        </IconButton>

        <IconButton color="inherit" onClick={handleGithubLogin}>
          <GithubLogo />
        </IconButton>

        <IconButton onClick={handleTwitterLogin}>
          <TwitterLogo color="#1C9CEA" />
        </IconButton>
      </Stack>
    </div>
  );
}
