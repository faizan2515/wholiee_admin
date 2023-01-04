import { useEffect, useContext, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import * as yup from "yup";
import _ from "@lodash";
import AvatarGroup from "@mui/material/AvatarGroup";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { resetPassword, selectUser } from "app/store/userSlice";
import { showMessage } from "app/store/fuse/messageSlice";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  email: yup
    .string()
    .email("You must enter a valid email")
    .required("You must enter a email"),
  otp: yup.string().required("You must enter an OTP"),
  password: yup.string().required("You must enter a password"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("You must enter a password"),
});

const defaultValues = {
  email: "",
  otp: "",
  password: "",
  confirm_password: "",
};

function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { email } = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { control, formState, handleSubmit, reset, setValue } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    if (email) {
      setValue("email", email);
    } else {
      navigate("/sign-in");
    }
  }, []);

  function onSubmit(data) {
    setIsLoading(true);
    console.log(data);
    dispatch(resetPassword(data)).then((response) => {
      setIsLoading(false);
      if (response.payload.status === 200) {
        reset(defaultValues);
        navigate("/sign-in");
        dispatch(
          showMessage({
            message: response.payload.data.message,
            variant: "success",
          })
        );
      } else if (response.payload.status === 400) {
        dispatch(
          showMessage({
            message: response.payload.data.message,
            variant: "error",
          })
        );
      } else {
        dispatch(
          showMessage({
            message: "Unknown error occurred",
            variant: "error",
          })
        );
      }
    });
  }

  return (
    <div className="flex flex-col flex-auto items-center sm:justify-center min-w-0">
      <Paper className="w-full sm:w-auto min-h-full sm:min-h-auto rounded-0 py-32 px-16 sm:p-48 sm:rounded-2xl sm:shadow">
        <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
          <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
            Forgot password?
          </Typography>
          <div className="flex items-baseline mt-2 font-medium">
            <Typography>Fill the form to reset your password</Typography>
          </div>

          <form
            name="registerForm"
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
                  type="email"
                  disabled
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            <Controller
              name="otp"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="OTP"
                  type="text"
                  error={!!errors.otp}
                  helperText={errors?.otp?.message}
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
              name="confirm_password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Confirm Password"
                  type="password"
                  error={!!errors.confirm_password}
                  helperText={errors?.confirm_password?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            <LoadingButton
              variant="contained"
              color="secondary"
              className=" w-full mt-4"
              aria-label="Register"
              disabled={_.isEmpty(dirtyFields) || !isValid}
              type="submit"
              size="large"
              loading={isLoading}
              loadingPosition="center"
            >
              Reset Password
            </LoadingButton>
            <Typography
              className="mt-32 text-md font-medium"
              color="text.secondary"
            >
              <span>Return to</span>
              <Link className="ml-4" to="/sign-in">
                Sign in
              </Link>
            </Typography>
          </form>
        </div>
      </Paper>
    </div>
  );
}

export default ResetPasswordPage;
