import Cookies from "js-cookie";

export const login = (token) => {
  Cookies.set("jwt_token", token);
};

export const logout = () => {
  Cookies.remove("jwt_token");
};

export const isAuthenticated = () => {
  return !!Cookies.get("jwt_token");
};

export const getToken = () => {
  return Cookies.get("jwt_token");
};
