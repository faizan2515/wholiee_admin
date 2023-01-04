import { lazy } from "react";

const Categories = lazy(() => import("./Categories"));

const CategoriesConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "categories",
      element: <Categories />,
    },
  ],
};

export default CategoriesConfig;
