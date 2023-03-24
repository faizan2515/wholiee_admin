import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import {
  Avatar,
  Button,
  Dialog,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  addProduct,
  getProducts,
  getUserProducts,
  selectProducts,
  setProduct,
  updateProduct,
} from "../store/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { getCategories } from "../../categories/store/categoriesSlice";
import { Box } from "@mui/system";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
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

const ProductDialog = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState("");
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
    dispatch(getCategories()).then((response) => {
      setCategories(response.payload.data.data);
    });
    if (product) {
      const category = categories.find(
        (category) => category.category === product.Product_Category
      );
      if (category) setSelectedCategory(category);
      setImage(product.Product_Image);

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
    if (product) {
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
    } else {
      dispatch(addProduct(data)).then(() => {
        handleClose();
        if (user.role === "admin") {
          dispatch(getProducts());
        } else if (user.role === "wholeseller") {
          dispatch(getUserProducts(user.data.id));
        }
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCategory(null);
    setImage("");
    if (product) {
      dispatch(setProduct(null));
    }
    reset(defaultValues);
  };

  return (
    <Dialog open={open}>
      <Paper className="p-24 w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
        <Typography className="text-4xl font-extrabold tracking-tight leading-tight">
          {product ? "Update" : "Add"} Product
        </Typography>

        <form
          noValidate
          className="flex flex-col justify-center w-full mt-32"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-auto items-center gap-10">
            <Controller
              control={control}
              name="Product_Image"
              render={({ field: { onChange, value } }) => (
                <Box
                  sx={{
                    borderWidth: 4,
                    borderStyle: "solid",
                    borderColor: "background.paper",
                  }}
                  className="relative flex items-center justify-center min-w-128 min-h-128 w-128 h-128 border-0 rounded-sm overflow-hidden mb-24"
                >
                  <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div>
                      {!value && (
                        <label
                          htmlFor="new-avatar"
                          className="flex p-8 cursor-pointer"
                        >
                          <input
                            accept="image/*"
                            className="hidden"
                            id="new-avatar"
                            type="file"
                            onChange={async (e) => {
                              function readFileAsync() {
                                return new Promise((resolve, reject) => {
                                  const file = e.target.files[0];
                                  if (!file) {
                                    return;
                                  }
                                  onChange(file);
                                  const reader = new FileReader();

                                  reader.onload = () => {
                                    resolve(
                                      `data:${file.type};base64,${btoa(
                                        reader.result
                                      )}`
                                    );
                                  };

                                  reader.onerror = reject;

                                  reader.readAsBinaryString(file);
                                });
                              }

                              const newImage = await readFileAsync();

                              setImage(newImage);
                            }}
                          />
                          <FuseSvgIcon className="text-white" size={24}>
                            heroicons-outline:camera
                          </FuseSvgIcon>
                        </label>
                      )}
                    </div>
                    <div>
                      {value && (
                        <IconButton
                          onClick={() => {
                            setImage("");
                            onChange(null);
                          }}
                        >
                          <FuseSvgIcon className="text-white" size={24}>
                            heroicons-solid:trash
                          </FuseSvgIcon>
                        </IconButton>
                      )}
                    </div>
                  </div>
                  <Avatar
                    sx={{
                      backgroundColor: "background.default",
                      color: "text.secondary",
                    }}
                    className="object-cover w-full h-full text-64 font-bold"
                    src={image}
                    alt="Profile Picture"
                  />
                </Box>
              )}
            />
            {errors.Product_Image && (
              <FormHelperText className="text-[12px] text-[#f44336]">
                {errors.Product_Image.message}
              </FormHelperText>
            )}
          </div>

          {user.role === "admin" && (
            <Controller
              name="Product_status"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth className="mb-24">
                  <InputLabel>Status</InputLabel>
                  <Select {...field} label="Status">
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          )}
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
                required
                fullWidth
              />
            )}
          />
          <Controller
            name="Product_Description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mb-24"
                label="Description"
                type="text"
                error={!!errors.Product_Description}
                helperText={errors?.Product_Description?.message}
                variant="outlined"
                required
                fullWidth
              />
            )}
          />
          <Controller
            name="Product_Category"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth className="mb-24">
                <InputLabel>Categories</InputLabel>
                <Select {...field} label="Categories">
                  {categories.map((category) => (
                    <MenuItem
                      value={category.category}
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category);
                      }}
                    >
                      {category.category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="Product_Per_Price"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mb-24"
                label="Price"
                type="number"
                error={!!errors.Product_Per_Price}
                helperText={errors?.Product_Per_Price?.message}
                variant="outlined"
                required
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

export default ProductDialog;
