import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Toaster } from "sonner";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import LoadingScreen from "./components/LoadingScreen";
import { disconnectSocket, initializeSocket } from "Redux/thunks/socketThunks";

const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

function App() {
  const mode = useSelector((state) => state.app.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  // const isAuth = Boolean(useSelector((state) => state.token));
  const isAuth = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuth) {
      dispatch(initializeSocket(isAuth._id));
    } else {
      dispatch(disconnectSocket());
    }
  }, [isAuth, dispatch]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {/* reset css of mui */}
          <CssBaseline />
          <Routes>
            <Route path="/" element={isAuth ? <HomePage /> : <LoginPage />} />
            <Route
              path="/login"
              element={isAuth ? <HomePage /> : <LoginPage />}
            />
            <Route
              path="/register"
              element={isAuth ? <HomePage /> : <RegisterPage />}
            />

            <Route
              path="/reset-password"
              element={isAuth ? <HomePage /> : <ResetPassPage />}
            />
            <Route
              path="/new-password"
              element={isAuth ? <HomePage /> : <NewPasswordPage />}
            />
            <Route
              path="/verify/:email"
              element={isAuth ? <HomePage /> : <VerifyPage />}
            />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/messages"
              element={isAuth ? <Messenger /> : <Navigate to="/login" />}
            />
            <Route
              path="/trash/:userId"
              element={isAuth ? <TrashPost /> : <Navigate to="/login" />}
            />
            <Route
              path="/storage/:userId"
              element={isAuth ? <StoragePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/memory/:userId"
              element={isAuth ? <MemoryPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/detail/post/:postId"
              element={isAuth ? <DetailPost /> : <Navigate to="/login" />}
            />
            <Route
              path="/results"
              element={isAuth ? <SearchPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/dashboard"
              element={
                isAuth && isAuth.role == "admin" ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/404" />
                )
              }
            />
            <Route path="/video-call/:roomId" component={VideoCall} />
            {/* <Route
              path="/searchWithAI"
              element={
                isAuth ? (
                  <SearchPageWithAIGenerateImage />
                ) : (
                  <Navigate to="/login" />
                )
              }
            /> */}
            <Route path="/404" element={<Page404 />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
      <Toaster position="top-right" closeButton richColors />
    </div>
  );
}

const HomePage = Loadable(lazy(() => import("scenes/homePage")));
// const LoginPage = Loadable(lazy(() => import("scenes/loginPage")));
const LoginPage = Loadable(lazy(() => import("scenes/auth/Login")));
const RegisterPage = Loadable(lazy(() => import("scenes/auth/Register")));
const ResetPassPage = Loadable(lazy(() => import("scenes/auth/ResetPassword")));
const NewPasswordPage = Loadable(lazy(() => import("scenes/auth/NewPassword")));
const VerifyPage = Loadable(lazy(() => import("scenes/auth/Verify")));
const ProfilePage = Loadable(lazy(() => import("scenes/profilePage")));
const Messenger = Loadable(lazy(() => import("scenes/messengerPage")));
const Page404 = Loadable(lazy(() => import("scenes/404Page")));
const TrashPost = Loadable(lazy(() => import("scenes/trashPostPage")));
const StoragePage = Loadable(lazy(() => import("scenes/storagePage")));
const MemoryPage = Loadable(lazy(() => import("scenes/memoryPage")));
const DetailPost = Loadable(lazy(() => import("scenes/detailPost")));
const SearchPage = Loadable(lazy(() => import("scenes/searchPage")));
const AdminDashboard = Loadable(lazy(() => import("scenes/adminDashboard")));
const VideoCall = Loadable(lazy(() => import("components/VideoCall")));
const SearchPageWithAIGenerateImage = Loadable(
  lazy(() => import("scenes/SearchPageWithAIGenerateImage"))
);

export default App;
