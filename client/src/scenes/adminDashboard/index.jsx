import React, { useState } from "react";
import Sidebar from "./componentsDashboard/Sidebar";
import PostManagement from "./componentsDashboard/PostManagement";
import UserManagement from "./componentsDashboard/UserManagement";
import Dashboard from "./componentsDashboard/Dashboard";

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "posts":
        return <PostManagement />;
      case "users":
        return <UserManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar setActivePage={setActivePage} activePage={activePage} />
      <div style={{ marginLeft: "250px", padding: "20px", width: "100%" }}>
        {renderPage()}
      </div>
    </div>
  );
};

export default AdminDashboard;
