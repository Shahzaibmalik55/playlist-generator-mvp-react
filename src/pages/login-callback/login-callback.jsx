import { Col, Row, Spin, Typography } from "antd";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LoadingOutlined } from "@ant-design/icons";
import { loginUser } from "../../apis/login";
import { useNotification } from "../../hooks/notification";

const { Title } = Typography;

export const LoginCallback = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { login } = useAuth();

  const { api } = useNotification();

  useEffect(() => {
    const query = new URLSearchParams(search);
    const code = query.get("code");
    const state = query.get("state");
    const hasError = query.get("error");
    if (hasError || !code || !state) {
      throw new Error("");
    }
    async function loginFromCode(params) {
      try {
        const data = await loginUser(params);
        login(data);
      } catch (err) {
        navigate("/login");
        api.error({
          message: err.message || "Login failed, please try again",
          placement: "top",
        });
      }
    }
    loginFromCode({
      code,
      state,
    });
  }, []);

  return (
    <Row justify={"center"}>
      <Col span={"auto"} style={{ textAlign: "center" }}>
        <Title>Please wait .... where logging you in</Title>
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </Col>
    </Row>
  );
};
