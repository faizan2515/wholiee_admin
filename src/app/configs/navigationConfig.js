import i18next from "i18next";
import ar from "./navigation-i18n/ar";
import en from "./navigation-i18n/en";
import tr from "./navigation-i18n/tr";
import { authRoles } from "../auth";

i18next.addResourceBundle("en", "navigation", en);
i18next.addResourceBundle("tr", "navigation", tr);
i18next.addResourceBundle("ar", "navigation", ar);

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
];

export default navigationConfig;
