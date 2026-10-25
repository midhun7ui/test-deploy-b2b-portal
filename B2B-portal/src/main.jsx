
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/global.css";
import "./styles/awsMap.css";
import App from "./App.jsx";
import { NotificationProvider } from "./features/notifications/NotificationContext";
import { SupportProvider } from "./features/support/SupportContext.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NotificationProvider>
      <SupportProvider>
      <App />
      </SupportProvider>
    </NotificationProvider>
  </StrictMode>
);
