import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getUsers = createAsyncThunk("users/getUsers", async () => {
  const response = await axios.get("api/get-users");
  return response;
});

export const addUser = createAsyncThunk("users/addUser", async (data) => {
  const response = await axios.post("api/register", { ...data });
  return response;
});

export const updateUser = createAsyncThunk("users/updateUser", async (data) => {
  const response = await axios.post(`api/${data.id}/update-user`, {
    email: data.email,
    name: data.name,
    role: data.role,
    status: data.status,
  });
  return response;
});

export const deleteUser = createAsyncThunk("users/deleteUser", async (id) => {
  const response = await axios.post(`api/delete-user/${id}`);
  return response;
});

const initialState = {
  isLoading: false,
  users: [],
  user: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: {
    [getUsers.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getUsers.rejected]: (state, action) => {
      state.users = [];
      state.isLoading = false;
    },
    [getUsers.fulfilled]: (state, action) => {
      if (action.payload.status === 200) {
        state.users = action.payload.data.data;
      }
      state.isLoading = false;
    },
    [updateUser.pending]: (state, action) => {
      state.isLoading = true;
    },
    [updateUser.rejected]: (state, action) => {
      state.isLoading = false;
    },
    [updateUser.fulfilled]: (state, action) => {
      state.isLoading = false;
    },
  },
});

export const selectUsers = ({ users }) => users.users;

export const { setUser } = usersSlice.actions;

export default usersSlice.reducer;
