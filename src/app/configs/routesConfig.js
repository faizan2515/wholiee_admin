import FuseUtils from "@fuse/utils";
import { Navigate } from "react-router-dom";
import settingsConfig from "app/configs/settingsConfig";
import SignInConfig from "../main/sign-in/SignInConfig";
import SignUpConfig from "../main/sign-up/SignUpConfig";
import SignOutConfig from "../main/sign-out/SignOutConfig";
import Error404Page from "../main/404/Error404Page";
import CategoriesConfig from "../main/categories/CategoriesConfig";
import ProductsConfig from "../main/products/ProductsConfig";
import UsersConfig from "../main/users/UsersConfig";
import ForgotPasswordConfig from "../main/forgot-password/ForgotPasswordConfig";

const routeConfigs = [
  CategoriesConfig,
  ProductsConfig,
  UsersConfig,
  SignOutConfig,
  SignInConfig,
  SignUpConfig,
  ForgotPasswordConfig,
];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(
    routeConfigs,
    settingsConfig.defaultAuth
  ),
  {
    path: "/",
    element: <Navigate to="/products" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: "*",
    element: <Error404Page />,
    auth: settingsConfig.defaultAuth,
  },
];

export default routes;
