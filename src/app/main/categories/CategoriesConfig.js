import { lazy } from "react";
import { authRoles } from "src/app/auth";

const Categories = lazy(() => import("./Categories"));

const CategoriesConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.admin,
  routes: [
    {
      path: "categories",
      element: <Categories />,
    },
  ],
};

export default CategoriesConfig;
