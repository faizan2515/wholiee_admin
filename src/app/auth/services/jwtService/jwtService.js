import FuseUtils from "@fuse/utils/FuseUtils";
import axios from "axios";
import jwtDecode from "jwt-decode";
import jwtServiceConfig from "./jwtServiceConfig";

/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
  init() {
    this.setInterceptors();
    this.handleAuthentication();
  }

  setInterceptors = () => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        return new Promise((resolve, reject) => {
          if (
            err.response.status === 401 &&
            err.config &&
            !err.config.__isRetryRequest
          ) {
            // if you ever get an unauthorized response, logout the user
            this.emit("onAutoLogout", "Invalid access_token");
            this.setSession(null);
          }
          throw err;
        });
      }
    );
  };

  handleAuthentication = () => {
    const token = this.getToken();

    if (!token) {
      this.emit("onNoAccessToken");

      return;
    }

    if (this.isAuthTokenValid(token)) {
      this.setSession(token);
      this.emit("onAutoLogin", true);
    } else {
      this.setSession(null);
      this.emit("onAutoLogout", "Token expired");
    }
  };

  createUser = (data) => {
    return new Promise((resolve, reject) => {
      axios
        .post(jwtServiceConfig.signUp, { ...data, role: "admin" })
        .then((response) => {
          if (response.data.success) {
            this.signInWithEmailAndPassword(data.email, data.password).then(
              (response) => {
                // No need to do anything, user data will be set at app/auth/AuthContext
              }
            );
          } else {
            reject(response.data.error);
          }
        });
    });
  };

  signInWithEmailAndPassword = async (email, password) => {
    const user = {};
    try {
      const response = await axios.post(jwtServiceConfig.logIn, {
        email,
        password,
      });
      if (response.data.success) {
        const userData = await axios.post(
          jwtServiceConfig.userDetail,
          {},
          {
            headers: {
              Authorization: `Bearer ${response.data.token}`,
            },
          }
        );
        user.role = userData.data.data.role;
        user.data = {
          ...userData.data.data,
          displayName: userData.data.data.name,
        };
        this.setSession(response.data.token);
        this.emit("onLogin", user);
      }
    } catch (error) {
      return error;
    }
  };

  signInWithToken = async () => {
    const token = this.getToken();
    const user = {};
    if (token) {
      try {
        const userData = await axios.post(jwtServiceConfig.userDetail);
        user.role = userData.data.data.role;
        user.data = {
          ...userData.data.data,
          displayName: userData.data.data.name,
        };
        return user;
      } catch (error) {
        this.logout();
      }
    } else {
      this.logout();
    }
  };

  updateUserData = (user) => {
    return axios.post(jwtServiceConfig.updateUser, {
      user,
    });
  };

  setSession = (token) => {
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common.Authorization;
    }
  };

  logout = () => {
    this.setSession(null);
    this.emit("onLogout", "Logged out");
  };

  isAuthTokenValid = (token) => {
    if (!token) {
      return false;
    }
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn("access token expired");
      return false;
    }

    return true;
  };

  getToken = () => {
    return window.localStorage.getItem("token");
  };
}

const instance = new JwtService();

export default instance;
