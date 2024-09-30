import { SpotifyOutlined } from "@ant-design/icons";
import { Button, Col, Row, Typography, notification } from "antd";
import { useEffect, useState } from "react";
import { loginUser } from "../../apis/login";
import { useAuth } from "../../hooks/useAuth";
import { useNotification } from "../../hooks/notification";

const { Title } = Typography;

export const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const { api } = useNotification();

  useEffect(() => {
    // if user is exists in local storage, login user to context
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      login(user);
    }
  }, []);

  const onLogin = async () => {
    try {
      setIsLoading(true);
      const data = await loginUser();
      window.location = data.redirectUrl;
    } catch (err) {
      api.error({
        message: err.message || "Login failed, please try again",
        placement: "top",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Row justify={"center"}>
      <Col span={"auto"}>
        <Title style={{ textAlign: "center" }}>Login</Title>
        <Button
          type="primary"
          shape="round"
          icon={<SpotifyOutlined style={{ fontSize: "1.1rem" }} />}
          loading={isLoading}
          style={{ backgroundColor: "#1db954" }}
          onClick={() => onLogin()}
        >
          Login with Spotify
        </Button>
      </Col>
    </Row>
  );
};
