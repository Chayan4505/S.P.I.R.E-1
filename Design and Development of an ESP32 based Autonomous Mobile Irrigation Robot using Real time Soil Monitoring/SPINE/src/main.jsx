// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { WebSocketProvider } from "./context/WebSocketContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { LoadScript } from "@react-google-maps/api";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <BrowserRouter>
        <AuthProvider>
          <WebSocketProvider>
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API}>
            <App />
          </LoadScript>
          </WebSocketProvider>
        </AuthProvider>
    </BrowserRouter>
  // </StrictMode>
);