import React, { createContext, useState, useContext } from 'react';
import { isAuthenticated as token}  from './authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated,setAuthenticated] = useState(token());
    const [userName,setUserName] = useState(token());

    
    console.log("isAuthenticated",isAuthenticated)
  return (
    <AuthContext.Provider value={{ isAuthenticated,setAuthenticated,userName,setUserName}}>
      {children}
    </AuthContext.Provider>
  );
};

