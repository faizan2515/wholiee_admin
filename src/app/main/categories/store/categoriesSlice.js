import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getCategories = createAsyncThunk(
  "categories/getCategories",
  async () => {
    const response = await axios.get("api/showall-cat");
    return response;
  }
);

export const addCategory = createAsyncThunk(
  "categories/addCategory",
  async (data) => {
    const response = await axios.post("api/catadd", { ...data });
    return response;
  }
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async (data) => {
    const response = await axios.post(`api/${data.id}/update-cat`, {
      category: data.category,
      category_min_quantity: data.category_min_quantity,
      category_max_quantity: data.category_max_quantity,
    });
    return response;
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id) => {
    const response = await axios.post(`api/delete-cat/${id}`);
    return response;
  }
);

const initialState = {
  isLoading: false,
  categories: [],
  category: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState: initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    },
  },
  extraReducers: {
    [getCategories.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getCategories.rejected]: (state, action) => {
      state.categories = [];
      state.isLoading = false;
    },
    [getCategories.fulfilled]: (state, action) => {
      if (action.payload.status === 200) {
        state.categories = action.payload.data.data;
      }
      state.isLoading = false;
    },
    [addCategory.pending]: (state, action) => {
      state.isLoading = true;
    },
    [addCategory.rejected]: (state, action) => {
      state.isLoading = false;
    },
    [addCategory.fulfilled]: (state, action) => {
      state.isLoading = false;
    },
    [updateCategory.pending]: (state, action) => {
      state.isLoading = true;
    },
    [updateCategory.rejected]: (state, action) => {
      state.isLoading = false;
    },
    [updateCategory.fulfilled]: (state, action) => {
      state.isLoading = false;
    },
    [deleteCategory.pending]: (state, action) => {
      state.isLoading = true;
    },
    [deleteCategory.rejected]: (state, action) => {
      state.isLoading = false;
    },
    [deleteCategory.fulfilled]: (state, action) => {
      state.isLoading = false;
    },
  },
});

export const selectCategories = ({ categories }) => categories.categories;

export const { setCategory } = categoriesSlice.actions;

export default categoriesSlice.reducer;
