import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./Components/Header";
import { ROUTES } from "./routes";
import NotFound from "./pages/notFound/NotFound";

function App() {
  const location = useLocation();
  const currentPath = location.pathname;
  
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
        
        {Object.values(ROUTES).map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        <Route path="/*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
