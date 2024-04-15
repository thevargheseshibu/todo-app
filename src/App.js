
import React from 'react';
import { Routes, Route, Router, Navigate } from "react-router-dom";
import { isAuthenticated } from './authentication/authService';
import NavBar from './components/NavBar';
import Footer from './components/Footer';



import Login from './Login';
import Register from './Register';
import HomePage from './Homepage';

export const withAuthRedirect = (Component) => {
  const RedirectAuthUsers = (props) => {
    // Check if the user is authenticated
    const isAuthenticatedUser = isAuthenticated();

    // If authenticated, render the component
    if (isAuthenticatedUser) {
      return Component;
    }

    // If not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  };

  return RedirectAuthUsers();
};

const App = () => {
  return (
    <>
      <div className='flex flex-col min-h-screen'>
        <NavBar />
        <main className="flex-grow flex items-center justify-center ">
          <Routes>
            <Route path="/" element={withAuthRedirect(<HomePage />)} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>


  );
};

export default App;