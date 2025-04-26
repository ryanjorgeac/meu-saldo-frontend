import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import "./App.css";
import { ROUTES } from "./routes";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

function App() {
  const location = useLocation();
  const { loading: authLoading } = useAuth();
  const currentPath = location.pathname;
  
  if (authLoading && Object.values(ROUTES).some(
    route => route.isProtected && (currentPath === route.path || currentPath.startsWith(`${route.path}/`))
  )) {
    return null;
  }

  const isKnownRoute = Object.values(ROUTES).some(
    route => route.path === currentPath || currentPath === "/"
  );
  
  const noHeaderPaths = Object.values(ROUTES)
    .filter(route => route.hideHeader)
    .map(route => route.path);

  const matchesNoHeaderPath = noHeaderPaths.some(path => 
    currentPath === path || currentPath.startsWith(`${path}/`)
  );

  const showHeader = isKnownRoute && !matchesNoHeaderPath;

  return (
    <Routes>
      <Route element={<AppLayout hideHeader={!showHeader}/>}>
        {Object.values(ROUTES).map(({ path, element, isProtected }) => (
          <Route 
            key={path} 
            path={path} 
            element={isProtected ? (
              <ProtectedRoute>{element}</ProtectedRoute>
            ) : element} 
          />
        ))}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
