import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async () => {
    const response = await axios.get("api/showall-prod");
    return response;
  }
);

export const getUserProducts = createAsyncThunk(
  "products/getUserProducts",
  async (id) => {
    const response = await axios.post(`api/single_pro_by_user/${id}`);
    return response;
  }
);

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (data) => {
    const response = await axios.post(
      "api/prod-add",
      { ...data },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (data) => {
    const response = await axios.post(
      `api/${data.id}/update-pro`,
      {
        ...data,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id) => {
    const response = await axios.post(`api/delete-pro/${id}`);
    return response;
  }
);

const initialState = {
  isLoading: false,
  products: [],
  product: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState: initialState,
  reducers: {
    setProduct: (state, action) => {
      state.product = action.payload;
    },
  },
  extraReducers: {
    [getProducts.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getProducts.rejected]: (state, action) => {
      state.products = [];
      state.isLoading = false;
    },
    [getProducts.fulfilled]: (state, action) => {
      if (action.payload.status === 200) {
        state.products = action.payload.data.data;
      }
      state.isLoading = false;
    },
    [getUserProducts.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getUserProducts.rejected]: (state, action) => {
      state.products = [];
      state.isLoading = false;
    },
    [getUserProducts.fulfilled]: (state, action) => {
      if (action.payload.status === 200) {
        state.products = action.payload.data.Product;
      }
      state.isLoading = false;
    },
    [addProduct.pending]: (state, action) => {
      state.isLoading = true;
    },
    [addProduct.rejected]: (state, action) => {
      state.isLoading = false;
    },
    [addProduct.fulfilled]: (state, action) => {
      state.isLoading = false;
    },
    [updateProduct.pending]: (state, action) => {
      state.isLoading = true;
    },
    [updateProduct.rejected]: (state, action) => {
      state.isLoading = false;
    },
    [updateProduct.fulfilled]: (state, action) => {
      state.isLoading = false;
    },
    [deleteProduct.pending]: (state, action) => {
      state.isLoading = true;
    },
    [deleteProduct.rejected]: (state, action) => {
      state.isLoading = false;
    },
    [deleteProduct.fulfilled]: (state, action) => {
      state.isLoading = false;
    },
  },
});

export const selectProducts = ({ products }) => products.products;

export const { setProduct } = productsSlice.actions;

export default productsSlice.reducer;
