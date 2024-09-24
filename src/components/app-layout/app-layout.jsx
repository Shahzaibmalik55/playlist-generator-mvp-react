import { Layout } from "antd";
import "./app-layout.scss";

const { Content } = Layout;

export const AppLayout = ({ children }) => {
  return (
    <Layout rootClassName="app-layout">
      <Content className="app-content">{children}</Content>
    </Layout>
  );
};
