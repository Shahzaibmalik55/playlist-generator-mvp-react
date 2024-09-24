import { ConfigProvider } from "antd";
import { Route, Routes } from "react-router";
import "./App.scss";

// components
import { ProtectedRoute } from "./components/protected-route/protected-route";
import { AppLayout } from "./components/app-layout/app-layout";

import { AuthProvider } from "./hooks/useAuth";

// Pages
import { MoodGenerator } from "./pages/mood-generator/mood-generator";
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
      <AppLayout>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MoodGenerator />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/callback" element={<LoginCallback />} />
          </Routes>
        </AuthProvider>
      </AppLayout>
    </ConfigProvider>
  );
}

export default App;
