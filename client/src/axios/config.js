import axios from "axios";
import jwt_decode from "jwt-decode";
import store from "../store/configureStore";
import { refreshToken, logoutUser } from "../actions/auth";

axios.defaults.baseURL = "http://localhost:5000/api/";

// Add a request interceptor
axios.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (
      config.headers.common.Authorization &&
      config.url !== "users/refreshToken"
    ) {
      const token = config.headers.common.Authorization.split(" ")[1];
      const decoded = jwt_decode(token);
      //Check for expired token
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        return store.dispatch(refreshToken({ token })).then(() => {
          return Promise.resolve(config);
        });
      } else {
        return Promise.resolve(config);
      }
    } else {
      return Promise.resolve(config);
    }
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response;
  },
  function(error) {
    if (error.response.status === 401) {
      return store.dispatch(logoutUser());
    }
    return Promise.reject(error);
  }
);
