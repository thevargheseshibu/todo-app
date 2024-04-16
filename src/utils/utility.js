import { jwtDecode } from "jwt-decode";

export const extractNameFromToken = (token) => {
  if (!token) {
    return "";
  }

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.name;
  } catch (error) {
    console.error("Error decoding token:", error);
    return "";
  }
};

export const getNextId = (items) => {
  if (items && items.length > 0) {
    return Math.max(...items.map((obj) => obj.id)) + 1;
  } else {
    return 0;
  }
};
