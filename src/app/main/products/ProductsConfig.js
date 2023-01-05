import { lazy } from "react";

const Products = lazy(() => import("./Products"));

const ProdcutsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "products",
      element: <Products />,
    },
  ],
};

export default ProdcutsConfig;
