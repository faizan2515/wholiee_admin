import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import * as yup from "yup";
import _ from "@lodash";
import AvatarGroup from "@mui/material/AvatarGroup";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import jwtService from "../../auth/services/jwtService";
import { LoadingButton } from "@mui/lab";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  email: yup.string(),
  // .email("You must enter a valid email")
  // .required("You must enter a email"),
  password: yup
    .string()
    .required("Please enter your password.")
    .min(4, "Password is too short - must be at least 4 chars."),
});

const defaultValues = {
  email: "",
  password: "",
  remember: true,
};

function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);

  const { control, formState, handleSubmit, setError, setValue } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setValue("email", "sufiyankhanzada1232@gmail.com", {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("password", "123456789", {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [setValue]);

  function onSubmit({ email, password }) {
    setIsLoading(true);
    jwtService
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        setIsLoading(false);
        if ("code" in response && response.code === "ERR_NETWORK") {
          dispatch(showMessage({ message: message, variant: "error" }));
        } else if ("code" in response && response.code === "ERR_BAD_REQUEST") {
          dispatch(
            showMessage({
              message: response.response.data.detail,
              variant: "error",
            })
          );
        } else if (response?.status === 500) {
          dispatch(
            showMessage({
              message: response.statusText,
              variant: "error",
            })
          );
        } else if (response?.password_reset_required) {
          dispatch(
            showMessage({
              message: "You need to change your password to proceed",
              variant: "success",
            })
          );
          navigate("/change-password");
        } else if (response?.status === 200) {
          setLoginDetails({
            username: response.data.username,
            password: response.data.password,
          });
          dispatch(
            showMessage({
              message:
                Object.keys(loginDetails).length === 0
                  ? "An opt code was sent to your email"
                  : response.data.detail,
              variant:
                Object.keys(loginDetails).length === 0 ? "success" : "error",
            })
          );
        }
        // No need to do anything, user data will be set at app/auth/AuthContext
      })
      .catch((_errors) => {
        _errors.forEach((error) => {
          setError(error.type, {
            type: "manual",
            message: error.message,
          });
        });
      });
  }

  return (
    <div className="flex flex-col flex-auto items-center sm:justify-center min-w-0">
      <Paper className="w-full sm:w-auto min-h-full sm:min-h-auto rounded-0 py-32 px-16 sm:p-48 sm:rounded-2xl sm:shadow">
        <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
          <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
            Sign in
          </Typography>
          <div className="flex items-baseline mt-2 font-medium">
            <Typography>Don't have an account?</Typography>
            <Link className="ml-4" to="/sign-up">
              Sign up
            </Link>
          </div>

          <form
            name="loginForm"
            noValidate
            className="flex flex-col justify-center w-full mt-32"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Email"
                  autoFocus
                  type="email"
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Password"
                  type="password"
                  error={!!errors.password}
                  helperText={errors?.password?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end">
              <Link className="text-md font-medium" to="/auth/forgot-password">
                Forgot password?
              </Link>
            </div>

            <LoadingButton
              variant="contained"
              color="secondary"
              className=" w-full mt-16"
              disabled={_.isEmpty(dirtyFields) || !isValid}
              type="submit"
              size="large"
              loading={isLoading}
              loadingPosition="center"
            >
              Sign in
            </LoadingButton>
          </form>
        </div>
      </Paper>
    </div>
  );
}

export default SignInPage;
