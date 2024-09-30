import { ConfigProvider, theme } from "antd";
import { Route, Routes } from "react-router";
import "./App.scss";

// components
import { ProtectedRoute } from "./components/protected-route/protected-route";
import { AppLayout } from "./components/app-layout/app-layout";

// Hooks
import { AuthProvider } from "./hooks/useAuth";
import { NotificationProvider } from "./hooks/notification";

// Pages
import { Home } from "./pages/home/home";
import { Login } from "./pages/login/login";
import { LoginCallback } from "./pages/login-callback/login-callback";

function App() {
  return (
    <ConfigProvider
      theme={{
        hashed: false,
        token: {
          fontFamily: "Roboto, sans-serif",
          colorPrimary: "#6565ce",
          colorBgBase: "0c0c0f",
        },
        algorithm: theme.darkAlgorithm,
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
                    <Home />
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
