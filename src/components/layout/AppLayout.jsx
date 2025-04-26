import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';

const AppLayout = ({ hideHeader = false }) => {
  const { loading } = useAuth();
  
  try {
    if (loading) {
      return <LoadingSpinner overlay={true} />;
    }

    return (
      <div className="app-container">
        {!hideHeader && <Header />}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error in AppLayout:", error);
    return (
      <div className="app-container">
        {!hideHeader && <Header />}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    );
  }
};

export default AppLayout;