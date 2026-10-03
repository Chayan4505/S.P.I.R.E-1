import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { Route, Routes, } from "react-router-dom";
import SoftBackdrop from './components/SoftBackdrop';
import AuthRoute from "./route/AuthRoute";
import ProtectedRoute from "./route/ProtectedRoute";
import PublicRoute from "./route/PublicRoute";
import Spinner from "./components/Spinner";
import Home from "./pages/Home";
import Signup from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import InitialLoader from "./components/InitialLoader";
import Dashboard from "./pages/Dashboard";
import TelemetryPage from "./pages/TelemetryPage";
import TelemetryHistoryPage from "./pages/TelemetryHistoryPage";
import ControlPage from "./pages/Controls";
import Maps from "./pages/Maps";
import AnalyticsPage from "./pages/AnalyticsPage";
import SpireAIPage from "./pages/SpireAIPage";
import CookieConsent from "./components/CookieConsent";
import NotFound from "./pages/NotFound";

function AppContent() {
  const { loading } = useAuth();
  const [showInitialLoader, setShowInitialLoader] = useState(true);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (showInitialLoader) {
    return (
      <InitialLoader onComplete={() => setShowInitialLoader(false)}/>
    );
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <Toaster />
      <SoftBackdrop />
      <CookieConsent />
      <Routes>
        <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
        <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />
        <Route path="/login" element={<AuthRoute><LogIn /></AuthRoute>} />
        <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
          <Route index element={<TelemetryPage/>}/>
          <Route path="latest-telemetry" element={<TelemetryPage/>} />
          <Route path="telemetry-history" element={<TelemetryHistoryPage />} />
          <Route path="controls" element={<ControlPage />} />
          <Route path="maps" element={<Maps />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="spire-ai" element={<SpireAIPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function App() {
  return <AppContent />;
}
