import { Layout } from "antd";
import "./app-layout.scss";
import { AppHeader } from "../app-header/app-header";

const { Content } = Layout;

export const AppLayout = ({ children }) => {
  return (
    <Layout rootClassName="app-layout">
      <AppHeader />
      <Content className="app-content">{children}</Content>
    </Layout>
  );
};
