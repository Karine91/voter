import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import { push } from "react-router-redux";
import { getPolls } from "./polls";

const loginAction = (token, dispatch) => {
  localStorage.setItem("jwtToken", token);
  setAuthToken(token);
  const decoded = jwt_decode(token);
  dispatch(setCurrentUser(decoded));
  dispatch(getPolls());
};

//Register User
export const registerUser = userData => dispatch => {
  axios
    .post("users/signup", userData)
    .then(res => {
      console.log(res.data);
    })
    .catch(err => {
      console.log(err.response);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};
//Login - Get User Token

export const loginUser = userData => dispatch => {
  axios
    .post("users/signin", userData)
    .then(res => {
      const { token } = res.data;
      loginAction(token, dispatch);
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const verifyEmail = userData => dispatch => {
  axios
    .post("users/verifyEmail", userData)
    .then(res => {
      const { token } = res.data;
      loginAction(token, dispatch);
      dispatch(push("/dashboard"));
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

//Log user out
export const logoutUser = () => dispatch => {
  localStorage.removeItem("jwtToken");
  setAuthToken(false);
  dispatch(setCurrentUser({}));
};
