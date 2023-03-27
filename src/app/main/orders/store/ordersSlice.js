import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getOrders = createAsyncThunk("orders/getOrders", async () => {
  const response = await axios.get("api/allorders");
  return response;
});

export const getSupplierOrders = createAsyncThunk(
  "orders/getSupplierOrders",
  async (id) => {
    const response = await axios.post(`api/get_supp_orders/${id}`);
    return response;
  }
);

export const addOrder = createAsyncThunk("orders/addOrder", async (data) => {
  const response = await axios.post(
    `api/addorder?First_name=${data.First_name}&Last_name=${data.Last_name}&Email=${data.Email}&Country=${data.Country}&City=${data.City}&State=${data.State}&Address=${data.Address}&Zipcode=${data.Zipcode}&Product_ids[]=${data.Product_ids}&Total=${data.Total}&user_ids[]=${data.user_ids}&status=${data.status}&quantity=${data.quantity}`
  );
  return response;
});

export const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  async (data) => {
    const response = await axios.post(
      `api/update-order/${data.id}?First_name=${data.First_name}&Last_name=${data.Last_name}&Email=${data.Email}&Country=${data.Country}&City=${data.City}&State=${data.State}&Address=${data.Address}&Zipcode=${data.Zipcode}&Product_ids[]=${data.Product_ids}&Total=${data.Total}&user_ids[]=${data.user_ids}&status=${data.status}&quantity=${data.quantity}`
    );
    return response;
  }
);

export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (id) => {
    const response = await axios.post(`api/delete-order/${id}`);
    return response;
  }
);

const initialState = {
  isLoading: false,
  orders: [],
  order: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState: initialState,
  reducers: {
    setOrder: (state, action) => {
      state.order = action.payload;
    },
  },
  extraReducers: {
    [getOrders.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getOrders.rejected]: (state, action) => {
      state.orders = [];
      state.isLoading = false;
    },
    [getOrders.fulfilled]: (state, action) => {
      if (action.payload.status === 200) {
        state.orders = action.payload.data.data;
      }
      state.isLoading = false;
    },
    [getSupplierOrders.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getSupplierOrders.rejected]: (state, action) => {
      state.orders = [];
      state.isLoading = false;
    },
    [getSupplierOrders.fulfilled]: (state, action) => {
      if (action.payload.status === 200) {
        state.orders = action.payload.data.data;
      }
      state.isLoading = false;
    },
    [addOrder.pending]: (state, action) => {
      state.isLoading = true;
    },
    [addOrder.rejected]: (state, action) => {
      state.isLoading = false;
    },
    [addOrder.fulfilled]: (state, action) => {
      state.isLoading = false;
    },
    [updateOrder.pending]: (state, action) => {
      state.isLoading = true;
    },
    [updateOrder.rejected]: (state, action) => {
      state.isLoading = false;
    },
    [updateOrder.fulfilled]: (state, action) => {
      state.isLoading = false;
    },
    [deleteOrder.pending]: (state, action) => {
      state.isLoading = true;
    },
    [deleteOrder.rejected]: (state, action) => {
      state.isLoading = false;
    },
    [deleteOrder.fulfilled]: (state, action) => {
      state.isLoading = false;
    },
  },
});

export const selectOrders = ({ orders }) => orders.orders;

export const { setOrder } = ordersSlice.actions;

export default ordersSlice.reducer;
