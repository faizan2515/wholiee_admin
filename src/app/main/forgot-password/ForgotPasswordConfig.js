import { lazy } from "react";

import { authRoles } from "src/app/auth";

const ForgotPasswordPage = lazy(() => import("./ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./ResetPasswordPage"));

const ForgotPasswordConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "auth/forgot-password",
      element: <ForgotPasswordPage />,
    },
    {
      path: "auth/reset-password",
      element: <ResetPasswordPage />,
    },
  ],
};

export default ForgotPasswordConfig;
