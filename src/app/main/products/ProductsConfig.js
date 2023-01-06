import { lazy } from "react";

const Products = lazy(() => import("./Products"));

const ProductsConfig = {
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

export default ProductsConfig;
