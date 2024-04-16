import React, { createContext, useState } from "react";
import { isAuthenticated as token } from "./authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(token());
  const [userName, setUserName] = useState(token());

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setAuthenticated, userName, setUserName }}
    >
      {children}
    </AuthContext.Provider>
  );
};
