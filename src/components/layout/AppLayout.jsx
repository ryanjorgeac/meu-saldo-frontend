import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../common/Header";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "../common/LoadingSpinner";
import "./AppLayout.css";

const AppLayout = ({ hideHeader = false }) => {
  const { loading } = useAuth();
  const location = useLocation();

  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(location.pathname);
  const mainContentClass = isAuthPage ? "main-content" : "main-content-with-padding";

  if (loading) {
    return <LoadingSpinner overlay={true} />;
  }
  
  return (
    <div className="app-container">
      {!hideHeader && <Header />}
      <main className={mainContentClass}>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
