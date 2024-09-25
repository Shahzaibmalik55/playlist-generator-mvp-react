import { Button, Col, Row } from "antd";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import "./app-header.scss";

export const AppHeader = () => {
  const { logout, user } = useAuth();

  return (
    <Row className="header">
      <Col span={24}>
        <Row align={"middle"} justify={"space-between"}>
          <Col className="bg-white" span={"auto"}>
            <NavLink to="/" className="link">
              <span className="px-2 font-20 font-bold">Playlistable</span>
            </NavLink>
          </Col>

          {!!user && (
            <Col span={"auto"}>
              <Button danger onClick={() => logout()}>
                Logout
              </Button>
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  );
};
