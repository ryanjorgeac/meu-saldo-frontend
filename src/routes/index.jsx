import {
  Dashboard,
  Categories,
  Login,
  Register,
  Profile,
  Transactions,
  Analytics,
} from "../pages";
import ForgotPassword from "../pages/auth/ForgotPassword";

export const ROUTES = {
  dashboard: {
    path: "/dashboard",
    element: <Dashboard />,
    isProtected: true,
  },
  categories: {
    path: "/categories",
    element: <Categories />,
    isProtected: true,
  },
  login: {
    path: "/login",
    element: <Login />,
    hideHeader: true,
    isProtected: false,
  },
  register: {
    path: "/register",
    element: <Register />,
    hideHeader: true,
    isProtected: false,
  },
  profile: {
    path: "/profile",
    element: <Profile />,
    isProtected: true,
  },
  transactions: {
    path: "/transactions",
    element: <Transactions />,
    isProtected: true,
  },
  analytics: {
    path: "/analytics",
    element: <Analytics />,
    isProtected: true,
  },
  forgotPassword: {
    path: "/forgot-password",
    element: <ForgotPassword />,
    hideHeader: true,
    isProtected: false,
  },
  // notFound: {
  //   path: "/*",
  //   element: <NotFound />,
  //   hideHeader: true,
  // }
};
