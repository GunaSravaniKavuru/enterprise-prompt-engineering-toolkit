import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import useTheme from "../../hooks/useTheme";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, toggleTheme] = useTheme();

  return (
    <div className="relative min-h-screen">
      <div className="ambient-glow" />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="relative z-10 flex min-h-screen flex-col lg:pl-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} theme={theme} onToggleTheme={toggleTheme} />
        <main className="flex-1 px-3 py-4 sm:px-4 lg:px-6 lg:py-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
