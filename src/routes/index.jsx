import {
  Dashboard,
  Categories,
  Login,
  Register,
  ResetPassword,
  Profile,
  NotFound,
  Transactions,
  Analytics,
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
  transactions: {
    path: "/transactions",
    element: <Transactions />,
  },
  analytics: {
    path: "/analytics",
    element: <Analytics />,
  },
  // notFound: {
  //   path: "/*",
  //   element: <NotFound />,
  //   hideHeader: true,
  // }
};
