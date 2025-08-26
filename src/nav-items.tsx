import Dashboard from "./pages/Dashboard";
import AnticipatoryRuntime from "./pages/AnticipatoryRuntime";

export const navItems = [
  {
    title: "Dashboard",
    to: "/dashboard",
    icon: "dashboard",
    page: <Dashboard />,
  },
  {
    title: "Anticipatory Runtime",
    to: "/workspace",
    icon: "zap",
    page: <AnticipatoryRuntime />,
  },
];