import { authRoles } from "../auth";

const navigationConfig = [
  {
    id: "categories",
    title: "Categories",
    type: "item",
    url: "categories",
    auth: authRoles.admin,
  },
  {
    id: "products",
    title: "Products",
    type: "item",
    url: "products",
    auth: authRoles.wholeseller,
  },
  {
    id: "users",
    title: "Users",
    type: "item",
    url: "users",
    auth: authRoles.admin,
  },
  {
    id: "stock-management",
    title: "Stock Management",
    type: "item",
    url: "stock-management",
    auth: authRoles.wholeseller,
  },
  {
    id: "orders",
    title: "Orders",
    type: "item",
    url: "orders",
    auth: authRoles.wholeseller,
  },
];

export default navigationConfig;
