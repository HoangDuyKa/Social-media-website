import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import LoadingScreen from "./components/LoadingScreen";

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
  const isAuth = useSelector((state) => state.auth.token);
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
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/messages"
              element={isAuth ? <Messenger /> : <Navigate to="/login" />}
            />
            <Route path="/404" element={<Page404 />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

const HomePage = Loadable(lazy(() => import("scenes/homePage")));
const LoginPage = Loadable(lazy(() => import("scenes/loginPage")));
const ProfilePage = Loadable(lazy(() => import("scenes/profilePage")));
const Messenger = Loadable(lazy(() => import("scenes/messengerPage")));
const Page404 = Loadable(lazy(() => import("scenes/404Page")));

export default App;
