import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { Button, Dialog, Paper, TextField, Typography } from "@mui/material";
import {
  addOrder,
  getOrders,
  selectOrders,
  setOrder,
  updateOrder,
} from "../store/ordersSlice";
import { useDispatch, useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { useEffect } from "react";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  First_name: yup
    .string()
    .min(4, "The first name must be at least 4 characters")
    .required("You must enter first name"),
  Last_name: yup.string().required("You must enter last name"),
  Email: yup
    .string()
    .email("Email not valid")
    .required("You must enter an email"),
  Country: yup.string().required("You must enter a county"),
  City: yup.string().required("You must enter a city"),
  State: yup.string().required("You must enter a state"),
  Address: yup.string().required("You must enter a address"),
  Zipcode: yup.string().required("You must enter a zipcode"),
  Product_ids: yup.string().required("You must enter a zipcode"),
  Total: yup.number().required("You must enter a total"),
});

const defaultValues = {
  First_name: "",
  Last_name: "",
  Email: "",
  Country: "",
  City: "",
  State: "",
  Address: "",
  Zipcode: "",
  Product_ids: "",
  Total: "",
  user_ids: "",
  status: "Pending",
  quantity: "",
};

const OrderDialog = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { isLoading, order } = useSelector(selectOrders);
  const { control, formState, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (order) {
      reset({
        First_name: order.First_name,
        Last_name: order.Last_name,
        Email: order.Email,
        Country: order.Country,
        City: order.City,
        State: order.State,
        Address: order.Address,
        Zipcode: order.Zipcode,
        Product_ids: order.Product_ids,
        Total: order.Total,
        user_ids: order.user_ids,
        status: order.status,
        quantity: order.quantity,
      });
      setOpen(true);
    }
  }, [order]);

  const { isValid, dirtyFields, errors } = formState;

  const onSubmit = (data) => {
    data.Total = data.Total.toString();
    if (order) {
      data.id = order.id;
      dispatch(updateOrder(data)).then(() => {
        handleClose();
        dispatch(getOrders());
      });
    } else {
      dispatch(addOrder(data)).then(() => {
        handleClose();
        dispatch(getOrders());
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    if (order) {
      dispatch(setOrder(null));
    }
    reset(defaultValues);
  };

  return (
    <Dialog open={open}>
      <Paper className="p-24 w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
        <Typography className="text-4xl font-extrabold tracking-tight leading-tight">
          {order ? "Update" : "Add"} Order
        </Typography>

        <form
          noValidate
          className="flex flex-col justify-center w-full mt-32"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name="First_name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mb-24"
                label="First Name"
                type="text"
                error={!!errors.First_name}
                helperText={errors?.First_name?.message}
                variant="outlined"
                required
                fullWidth
              />
            )}
          />
          <Controller
            name="Last_name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mb-24"
                label="Last Name"
                type="text"
                error={!!errors.Last_name}
                helperText={errors?.Last_name?.message}
                variant="outlined"
                required
                fullWidth
              />
            )}
          />
          <Controller
            name="Email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mb-24"
                label="Email"
                type="text"
                error={!!errors.Email}
                helperText={errors?.Email?.message}
                variant="outlined"
                required
                fullWidth
              />
            )}
          />
          <Controller
            name="Country"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mb-24"
                label="Country"
                type="text"
                error={!!errors.Country}
                helperText={errors?.Country?.message}
                variant="outlined"
                required
                fullWidth
              />
            )}
          />
          <Controller
            name="City"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mb-24"
                label="City"
                type="text"
                error={!!errors.City}
                helperText={errors?.City?.message}
                variant="outlined"
                required
                fullWidth
              />
            )}
          />
          <Controller
            name="State"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mb-24"
                label="State"
                type="text"
                error={!!errors.State}
                helperText={errors?.State?.message}
                variant="outlined"
                required
                fullWidth
              />
            )}
          />
          <Controller
            name="Address"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mb-24"
                label="Address"
                type="text"
                error={!!errors.Address}
                helperText={errors?.Address?.message}
                variant="outlined"
                required
                fullWidth
              />
            )}
          />
          <Controller
            name="Zipcode"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mb-24"
                label="Zipcode"
                type="text"
                error={!!errors.Zipcode}
                helperText={errors?.Zipcode?.message}
                variant="outlined"
                required
                fullWidth
              />
            )}
          />
          <Controller
            name="Product_ids"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mb-24"
                label="Product ids"
                type="text"
                error={!!errors.Product_ids}
                helperText={errors?.Product_ids?.message}
                variant="outlined"
                required
                fullWidth
              />
            )}
          />
          <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mb-24"
                label="Product quantities"
                type="text"
                error={!!errors.quantity}
                helperText={errors?.quantity?.message}
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

export default OrderDialog;
