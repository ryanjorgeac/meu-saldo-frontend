import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./Components/Header";
import { ROUTES } from "./routes";

function App() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Find current route and determine if header should be shown
  const currentRoute = Object.values(ROUTES).find(route => route.path === currentPath);
  const showHeader = !(currentRoute?.hideHeader);

  return (
    <>
      {showHeader && <Header />}
      <main>
        <Routes>
        <Route path="/" element={<Navigate to={ROUTES.dashboard.path} replace />} />
        
        {Object.values(ROUTES).map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        </Routes>
      </main>
    </>
  );
}

export default App;
