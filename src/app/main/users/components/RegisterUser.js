import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import {
  Button,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { addUser, getUsers, selectUsers, setUser } from "../store/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";

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
  role: yup.string().required("You must select a role"),
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
  role: "wholeseller",
  password: "",
  c_password: "",
};

const RegisterUser = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(selectUsers);
  const { control, formState, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const onSubmit = (data) => {
    dispatch(addUser(data)).then(() => {
      handleClose();
      dispatch(getUsers());
    });
  };

  const handleClose = () => {
    setOpen(false);
    reset(defaultValues);
  };

  return (
    <Dialog open={open}>
      <Paper className="p-24 w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
        <Typography className="text-4xl font-extrabold tracking-tight leading-tight">
          Add User
        </Typography>

        <form
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
                label="Name"
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
                type="emai"
                error={!!errors.email}
                helperText={errors?.email?.message}
                variant="outlined"
                required
                fullWidth
              />
            )}
          />
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth className="mb-24">
                <InputLabel>Role</InputLabel>
                <Select {...field} label="Role">
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="wholeseller">Whole Seller</MenuItem>
                </Select>
              </FormControl>
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
          <div className="flex justify-end gap-10">
            <LoadingButton
              loading={isLoading}
              variant="contained"
              color="secondary"
              disabled={_.isEmpty(dirtyFields) || !isValid}
              type="submit"
            >
              Save
            </LoadingButton>
            <Button onClick={() => handleClose()}>Cancel</Button>
          </div>
        </form>
      </Paper>
    </Dialog>
  );
};

export default RegisterUser;
