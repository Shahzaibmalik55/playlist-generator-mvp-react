import { ConfigProvider } from "antd";
import { Route, Routes } from "react-router";
import "./App.scss";

// components
import { ProtectedRoute } from "./components/protected-route/protected-route";
import { AppLayout } from "./components/app-layout/app-layout";

import { AuthProvider } from "./hooks/useAuth";

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
    </ConfigProvider>
  );
}

export default App;
