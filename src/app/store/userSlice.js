/* eslint import/no-extraneous-dependencies: off */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import history from "@history";
import _ from "@lodash";
import { setInitialSettings } from "app/store/fuse/settingsSlice";
import { showMessage } from "app/store/fuse/messageSlice";
import settingsConfig from "app/configs/settingsConfig";
import jwtService from "../auth/services/jwtService";
import jwtServiceConfig from "../auth/services/jwtService/jwtServiceConfig";
import axios from "axios";

export const setUser = createAsyncThunk(
  "user/setUser",
  async (user, { dispatch, getState }) => {
    /*
    You can redirect the logged-in user to a specific route depending on his role
    */
    if (user.loginRedirectUrl) {
      settingsConfig.loginRedirectUrl = user.loginRedirectUrl; // for example 'apps/academy'
    }

    return user;
  }
);

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async ({ email }, { dispatch, getState }) => {
    dispatch(setEmail(email));
    const response = await axios.post(jwtServiceConfig.resetPassword, {
      email: email,
    });

    return response;
  }
);

export const setEmail = createAsyncThunk(
  "user/setEmail",
  async (email, { dispatch, getState }) => {
    return email;
  }
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ otp, password, confirm_password }, { dispatch, getState }) => {
    const {
      user: { email },
    } = getState();
    try {
      const response = await axios.post(jwtServiceConfig.verifyOtp, {
        email: email,
        otp: otp,
        password: password,
        confirm_password: confirm_password,
      });

      return response;
    } catch (error) {
      return error.response;
    }
  }
);

export const updateUserSettings = createAsyncThunk(
  "user/updateSettings",
  async (settings, { dispatch, getState }) => {
    const { user } = getState();
    const newUser = _.merge({}, user, { data: { settings } });

    dispatch(updateUserData(newUser));

    return newUser;
  }
);

export const updateUserShortcuts = createAsyncThunk(
  "user/updateShortucts",
  async (shortcuts, { dispatch, getState }) => {
    const { user } = getState();
    const newUser = {
      ...user,
      data: {
        ...user.data,
        shortcuts,
      },
    };

    dispatch(updateUserData(newUser));

    return newUser;
  }
);

export const logoutUser = () => async (dispatch, getState) => {
  const { user } = getState();

  if (!user.role || user.role.length === 0) {
    // is guest
    return null;
  }

  history.push({
    pathname: "/",
  });

  dispatch(setInitialSettings());

  return dispatch(userLoggedOut());
};

export const updateUserData = (user) => async (dispatch, getState) => {
  if (!user.role || user.role.length === 0) {
    // is guest
    return;
  }

  jwtService
    .updateUserData(user)
    .then(() => {
      dispatch(showMessage({ message: "User data saved with api" }));
    })
    .catch((error) => {
      dispatch(showMessage({ message: error.message }));
    });
};

const initialState = {
  role: [], // guest
  data: {
    displayName: "John Doe",
    photoURL: "assets/images/avatars/brian-hughes.jpg",
    email: "johndoe@withinpixels.com",
    shortcuts: ["apps.calendar", "apps.mailbox", "apps.contacts", "apps.tasks"],
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLoggedOut: (state, action) => initialState,
  },
  extraReducers: {
    [updateUserSettings.fulfilled]: (state, action) => action.payload,
    [updateUserShortcuts.fulfilled]: (state, action) => action.payload,
    [setUser.fulfilled]: (state, action) => action.payload,
    [forgotPassword.fulfilled]: (state, action) => {
      if (action.payload.data.success) {
        return { ...state, message: action.payload.data.message };
      }
    },
    [setEmail.fulfilled]: (state, action) => {
      return { ...state, email: action.payload };
    },
    [resetPassword.fulfilled]: (state, action) => {
      return { ...state, message: action.payload.detail };
    },
  },
});

export const { userLoggedOut } = userSlice.actions;

export const selectUser = ({ user }) => user;

export const selectUserShortcuts = ({ user }) => user.data.shortcuts;

export default userSlice.reducer;
