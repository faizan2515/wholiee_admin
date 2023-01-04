import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { Button, Dialog, Paper, TextField, Typography } from "@mui/material";
import {
  addCategory,
  getCategories,
  selectCategories,
  setCategory,
  updateCategory,
} from "../store/categoriesSlice";
import { useDispatch, useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { useEffect } from "react";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  category: yup.string().required("You must enter a name"),
  category_min_quantity: yup
    .number()
    .positive()
    .required()
    .min(1, "Minimum quantity must be at least 1"),
  category_max_quantity: yup
    .number()
    .positive()
    .required()
    .min(1, "Maximum quantity must be greater than 1"),
});

const defaultValues = {
  category: "",
  category_min_quantity: 1,
  category_max_quantity: 1,
};

const CategoryDialog = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { isLoading, category } = useSelector(selectCategories);
  const { control, formState, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (category) {
      reset({
        category: category.category,
        category_min_quantity: category.category_min_quantity,
        category_max_quantity: category.category_max_quantity,
      });
      setOpen(true);
    }
  }, [category]);

  const { isValid, dirtyFields, errors } = formState;

  const onSubmit = (data) => {
    data.category_min_quantity = data.category_min_quantity.toString();
    data.category_max_quantity = data.category_max_quantity.toString();
    if (category) {
      data.id = category.id;
      dispatch(updateCategory(data)).then(() => {
        handleClose();
        dispatch(getCategories());
      });
    } else {
      dispatch(addCategory(data)).then(() => {
        handleClose();
        dispatch(getCategories());
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    if (category) {
      dispatch(setCategory(null));
    }
    reset(defaultValues);
  };

  return (
    <Dialog open={open}>
      <Paper className="p-24 w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
        <Typography className="text-4xl font-extrabold tracking-tight leading-tight">
          Add Category
        </Typography>

        <form
          noValidate
          className="flex flex-col justify-center w-full mt-32"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mb-24"
                label="Name"
                type="text"
                error={!!errors.category}
                helperText={errors?.category?.message}
                variant="outlined"
                required
                fullWidth
              />
            )}
          />
          <Controller
            name="category_min_quantity"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mb-24"
                label="Min quantity"
                type="number"
                error={!!errors.category_min_quantity}
                helperText={errors?.category_min_quantity?.message}
                variant="outlined"
                required
                fullWidth
              />
            )}
          />
          <Controller
            name="category_max_quantity"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mb-24"
                label="Max quantity"
                type="number"
                error={!!errors.category_max_quantity}
                helperText={errors?.category_max_quantity?.message}
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

export default CategoryDialog;
