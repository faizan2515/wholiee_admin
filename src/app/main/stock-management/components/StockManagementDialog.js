import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { Button, Dialog, Paper, TextField, Typography } from "@mui/material";
import {
  getProducts,
  getUserProducts,
  selectProducts,
  setProduct,
  updateProduct,
} from "../../products/store/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { selectUser } from "app/store/userSlice";

/**
 * Form Validation Schema
 */

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

const defaultValues = {
  Product_name: "",
  Product_Category: "",
  Product_Description: "",
  Product_Image: "",
  Product_Per_Price: 0,
  Product_Available_Qty: 0,
  Product_status: "Pending",
};

const StockManagementDialog = ({ open, setOpen, categories }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { isLoading, product } = useSelector(selectProducts);

  const schema = yup.object().shape({
    Product_name: yup.string().required("You must enter a name"),
    Product_Category: yup.string().required("You must select a category"),
    Product_Description: yup.string().required("You must enter a description"),
    Product_Per_Price: yup
      .number()
      .min(0, "Enter positive number")
      .required("You must enter a price"),
    Product_Available_Qty: yup
      .number()
      .min(selectedCategory ? selectedCategory.category_min_quantity : 0)
      .max(selectedCategory ? selectedCategory.category_max_quantity : 0)
      .required("You must enter a quantity"),
    Product_Image: yup
      .mixed()
      .test("fileType", "Supported formats are png, jpg & jpeg", (value) => {
        if (!value || typeof value === "string") return true;
        return value && SUPPORTED_FORMATS.includes(value.type);
      }),
    Product_status: yup.string(),
  });

  const {
    control,
    formState,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const quantity = watch("Product_Available_Qty");

  useEffect(() => {
    if (product) {
      const category = categories.find(
        (category) => category.category === product.Product_Category
      );
      if (category) setSelectedCategory(category);

      reset({
        Product_name: product.Product_name,
        Product_Category: product.Product_Category,
        Product_Description: product.Product_Description,
        Product_Image: product.Product_Image,
        Product_Per_Price: parseInt(product.Product_Per_Price),
        Product_Available_Qty: parseInt(product.Product_Available_Qty),
        Product_status: product.Product_status,
      });
      setOpen(true);
    }
  }, [product]);

  useEffect(() => {
    if (
      quantity < parseInt(selectedCategory?.category_min_quantity) ||
      quantity > parseInt(selectedCategory?.category_max_quantity)
    ) {
      setError("Product_Available_Qty", {
        type: "custom",
      });
    } else {
      clearErrors("Product_Available_Qty");
    }
  }, [selectedCategory]);

  const onSubmit = (data) => {
    data.Product_Per_Price = data.Product_Per_Price.toString();
    data.Product_Available_Qty = data.Product_Available_Qty.toString();
    data.user_id = user.data.id;
    data.id = product.id;
    delete data.Product_Image;
    dispatch(updateProduct(data)).then(() => {
      handleClose();
      if (user.role === "admin") {
        dispatch(getProducts());
      } else if (user.role === "wholeseller") {
        dispatch(getUserProducts(user.data.id));
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCategory(null);
    if (product) {
      dispatch(setProduct(null));
    }
    reset(defaultValues);
  };

  return (
    <Dialog open={open}>
      <Paper className="p-24 w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
        <Typography className="text-3xl font-extrabold tracking-tight leading-tight">
          Edit Product Quantity
        </Typography>

        <form
          noValidate
          className="flex flex-col justify-center w-full mt-32"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name="Product_name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mb-24"
                label="Name"
                type="text"
                error={!!errors.Product_name}
                helperText={errors?.Product_name?.message}
                variant="outlined"
                disabled
                fullWidth
              />
            )}
          />

          <Controller
            name="Product_Category"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mb-24"
                label="Category"
                type="text"
                error={!!errors.Product_Category}
                helperText={errors?.Product_Category?.message}
                variant="outlined"
                disabled
                fullWidth
              />
            )}
          />
          <Controller
            name="Product_Available_Qty"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mb-24"
                label="Available quantity"
                type="number"
                error={!!errors.Product_Available_Qty}
                helperText={
                  selectedCategory &&
                  `Min quantity: ${selectedCategory.category_min_quantity} Max quantity: ${selectedCategory.category_max_quantity}`
                }
                variant="outlined"
                disabled={!selectedCategory}
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
              disabled={
                _.isEmpty(dirtyFields) || !isValid || !_.isEmpty(errors)
              }
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

export default StockManagementDialog;
