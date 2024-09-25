import { createContext, useContext, useMemo } from "react";
import { notification } from "antd";

const NotificationContext = createContext({});

// Custom hook to use the notification context
export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  const contextValue = useMemo(() => ({ api }), []);

  return (
    <NotificationContext.Provider value={contextValue}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};
