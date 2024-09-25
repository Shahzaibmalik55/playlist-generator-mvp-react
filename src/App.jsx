import { ConfigProvider } from "antd";
import { Route, Routes } from "react-router";
import "./App.scss";

// components
import { ProtectedRoute } from "./components/protected-route/protected-route";
import { AppLayout } from "./components/app-layout/app-layout";

// Hooks
import { AuthProvider } from "./hooks/useAuth";
import { NotificationProvider } from "./hooks/notification";

// Pages
import { MoodPlaylistGenerator } from "./pages/mood-playlist-generator/mood-playlist-generator";
import { Login } from "./pages/login/login";
import { LoginCallback } from "./pages/login-callback/login-callback";

function App() {
  return (
    <ConfigProvider
      theme={{
        hashed: false,
        token: { fontFamily: "Roboto, sans-serif", colorPrimary: "#1db954" },
      }}
    >
      <NotificationProvider>
        <AuthProvider>
          <AppLayout>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <MoodPlaylistGenerator />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/callback" element={<LoginCallback />} />
            </Routes>
          </AppLayout>
        </AuthProvider>
      </NotificationProvider>
    </ConfigProvider>
  );
}

export default App;
