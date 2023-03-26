import { lazy } from "react";
import { authRoles } from "src/app/auth";

const Orders = lazy(() => import("./Orders"));

const OrdersConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.wholeseller,
  routes: [
    {
      path: "orders",
      element: <Orders />,
    },
  ],
};

export default OrdersConfig;
