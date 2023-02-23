import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import _ from "@lodash";
import Paper from "@mui/material/Paper";
import jwtService from "../../auth/services/jwtService";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup
    .string()
    .min(4, "The name must be at least 4 characters")
    .required("You must enter display name"),
  email: yup
    .string()
    .email("You must enter a valid email")
    .required("You must enter a email"),
  password: yup
    .string()
    .min(8, "The password must be at least 8 characters")
    .required("Please enter your password."),
  c_password: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const defaultValues = {
  name: "",
  email: "",
  password: "",
  c_password: "",
};

function SignUpPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const { control, formState, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  function onSubmit({ name, email, password, c_password }) {
    setIsLoading(true);
    jwtService
      .createUser(name, email, password, c_password)
      .then((response) => {
        setIsLoading(false);
        if (response.status === 200) {
          navigate("/sign-in");
          dispatch(
            showMessage({
              message: "Wait for admin to approve your account",
              variant: "success",
            })
          );
        }
        // No need to do anything, registered user data will be set at app/auth/AuthContext
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div className="flex flex-col flex-auto items-center sm:justify-center min-w-0">
      <Paper className="w-full sm:w-auto min-h-full sm:min-h-auto rounded-0 py-32 px-16 sm:p-48 sm:rounded-2xl sm:shadow">
        <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
          <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
            Sign up
          </Typography>
          <div className="flex items-baseline mt-2 font-medium">
            <Typography>Already have an account?</Typography>
            <Link className="ml-4" to="/sign-in">
              Sign in
            </Link>
          </div>

          <form
            name="registerForm"
            noValidate
            className="flex flex-col justify-center w-full mt-32"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Display name"
                  autoFocus
                  type="text"
                  error={!!errors.name}
                  helperText={errors?.name?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Email"
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

            <Controller
              name="c_password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Password (Confirm)"
                  type="password"
                  error={!!errors.c_password}
                  helperText={errors?.c_password?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />

            <LoadingButton
              variant="contained"
              color="secondary"
              className="w-full mt-24"
              aria-label="Register"
              disabled={_.isEmpty(dirtyFields) || !isValid}
              type="submit"
              size="large"
              loading={isLoading}
              loadingPosition="center"
            >
              Create an account
            </LoadingButton>
          </form>
        </div>
      </Paper>
    </div>
  );
}

export default SignUpPage;
