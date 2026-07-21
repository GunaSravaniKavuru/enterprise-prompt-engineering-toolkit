import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import { ToastProvider } from "./components/common/Toast";
import Profile from "./pages/Profile";

import Dashboard from "./pages/Dashboard";
import PromptBuilder from "./pages/PromptBuilder";
import PromptLibrary from "./pages/PromptLibrary";
import PromptDetails from "./pages/PromptDetails";
import Playground from "./pages/Playground";
import PromptOptimizer from "./pages/PromptOptimizer";
import PromptEvaluator from "./pages/PromptEvaluator";
import ModelComparison from "./pages/ModelComparison";
import VersionHistory from "./pages/VersionHistory";
import Analytics from "./pages/Analytics";
import ExportImport from "./pages/ExportImport";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppRoutes() {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
  element={
    isLoggedIn ? (
      <DashboardLayout />
    ) : (
      <Navigate to="/login" replace />
    )
  }
>
       <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/builder" element={<PromptBuilder />} />
        <Route path="/library" element={<PromptLibrary />} />
        <Route path="/library/:id" element={<PromptDetails />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/optimizer" element={<PromptOptimizer />} />
        <Route path="/evaluator" element={<PromptEvaluator />} />
        <Route path="/comparison" element={<ModelComparison />} />
        <Route path="/versions" element={<VersionHistory />} />
        <Route path="/version-history" element={<VersionHistory />} />
        <Route path="/versionhistory" element={<VersionHistory />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/export-import" element={<ExportImport />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
