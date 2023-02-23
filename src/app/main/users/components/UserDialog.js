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
import {
  getUsers,
  selectUsers,
  setUser,
  updateUser,
} from "../store/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { useEffect } from "react";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("You must enter an email"),
  name: yup.string().required("You must enter a name"),
  role: yup.string().required("You must select a role"),
  status: yup.string().required("You must select a status"),
});

const defaultValues = {
  email: "",
  name: "",
  role: "wholeseller",
  status: "Pending",
};

const UserDialog = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { isLoading, user } = useSelector(selectUsers);
  const { control, formState, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      });
      setOpen(true);
    }
  }, [user]);

  const onSubmit = (data) => {
    if (user) {
      data.id = user.id;
      dispatch(updateUser(data)).then(() => {
        handleClose();
        dispatch(getUsers());
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    if (user) {
      dispatch(setUser(null));
    }
    reset(defaultValues);
  };

  return (
    <Dialog open={open}>
      <Paper className="p-24 w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
        <Typography className="text-4xl font-extrabold tracking-tight leading-tight">
          Edit User
        </Typography>

        <form
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
            name="status"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth className="mb-24">
                <InputLabel>Status</InputLabel>
                <Select {...field} label="Status">
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                </Select>
              </FormControl>
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

export default UserDialog;
