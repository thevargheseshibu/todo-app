// PrivateRoute.js
import React ,{useContext} from 'react';
import { Route, Navigate } from 'react-router-dom';



import { AuthContext } from '../authentication/authContext';

const PrivateRoute = ({ children}) => {
    const isAuthenticated = useContext(AuthContext);

    console.log("isAuthenticated2",isAuthenticated?.isAuthenticated)
  
    return (
    isAuthenticated?.isAuthenticated ? children : <Navigate to="/login" replace />
  
    );
  };
  
  export default PrivateRoute;


