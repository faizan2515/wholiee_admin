import { lazy } from "react";

const StockManagement = lazy(() => import("./StockManagement"));

const StockManagementConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "stock-management",
      element: <StockManagement />,
    },
  ],
};

export default StockManagementConfig;
