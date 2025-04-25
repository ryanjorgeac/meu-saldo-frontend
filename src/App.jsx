import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import "./App.css";
import Header from "./components/Header";
import { ROUTES } from "./routes";
import NotFound from "./pages/notFound/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

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
    <>
      {showHeader && <Header />}
      <main>
        <Routes>
        <Route path="/" element={<Navigate to={ROUTES.dashboard.path} replace />} />
        
        {Object.values(ROUTES).map(({ path, element, isProtected }) => (
          <Route key={path} path={path} element={getElement(element, isProtected)} />
        ))}

        <Route path="/*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

function getElement(element, isProtected=false) {
  if (isProtected) {
    return <ProtectedRoute>{element}</ProtectedRoute>;
  }
  return element;
}

export default App;
