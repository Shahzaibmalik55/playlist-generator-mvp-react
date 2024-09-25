import { useState } from "react";
import { Button, Col, Popover, Row } from "antd";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import "./app-header.scss";

export const AppHeader = () => {
  const { logout, user } = useAuth();

  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

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
              <Popover
                content={
                  <Button onClick={logout} color="danger" variant="text">
                    Logout
                  </Button>
                }
                trigger="click"
                open={open}
                onOpenChange={handleOpenChange}
              >
                <Button color="primary" variant="outlined" size="large">
                  {user.display_name}
                </Button>
              </Popover>
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  );
};
