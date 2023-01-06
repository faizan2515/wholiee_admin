import { lazy } from "react";
import { authRoles } from "src/app/auth";

const Users = lazy(() => import("./Users"));

const UsersConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.admin,
  routes: [
    {
      path: "users",
      element: <Users />,
    },
  ],
};

export default UsersConfig;
