import {
  Categories,
  Login,
  Register,
  Transactions
} from "../pages";
import ForgotPassword from "../pages/auth/ForgotPassword";

export const ROUTES = {
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
  transactions: {
    path: "/transactions",
    element: <Transactions />,
    isProtected: true,
  },
  forgotPassword: {
    path: "/forgot-password",
    element: <ForgotPassword />,
    hideHeader: true,
    isProtected: false,
  }
};
