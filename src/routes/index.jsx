import {
  Dashboard,
  Categories,
  Login,
  Register,
  ResetPassword,
  Profile,
} from "../pages";

export const ROUTES = {
  dashboard: {
    path: "/dashboard",
    element: <Dashboard />,
  },
  categories: {
    path: "/categories",
    element: <Categories />,
  },
  login: {
    path: "/login",
    element: <Login />,
    hideHeader: true,
  },
  register: {
    path: "/register",
    element: <Register />,
    hideHeader: true,
  },
  resetPassword: {
    path: "/reset-password",
    element: <ResetPassword />,
    hideHeader: true,
  },
  profile: {
    path: "/profile",
    element: <Profile />,
  },
};
