import { SpotifyOutlined } from "@ant-design/icons";
import { Button, Col, Row, Typography, notification } from "antd";
import { useEffect, useState } from "react";
import { loginUser } from "../../apis/login";
import { useAuth } from "../../hooks/useAuth";

const { Title } = Typography;

export const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const [api, contextHolder] = notification.useNotification();

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
    <Row>
      {contextHolder}
      <Col span={24}>
        <Title>Login</Title>
        <Button
          type="primary"
          shape="round"
          icon={<SpotifyOutlined size={30} />}
          loading={isLoading}
          onClick={() => onLogin()}
        >
          Login with Spotify
        </Button>
      </Col>
    </Row>
  );
};
