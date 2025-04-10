import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/dashboard.tsx"),
    route("/categories","routes/categories.tsx"),
    route("/transactions","routes/transactions.tsx"),
    route("/profile","routes/profile.tsx"),
    route("/login","routes/login.tsx"),
    route("/register","routes/register.tsx"),
    route("/forgot-password","routes/forgot-password.tsx"),
    route("/analytics","routes/analytics.tsx"),
] satisfies RouteConfig;
