import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated } from './authentication/authService';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Login from './Login';
import Register from './Register';
import HomePage from './Homepage';
import { AuthProvider } from './authentication/authContext';
import PrivateRoute from './routes/PrivateRoute';

const App = () => {
  return (
    <AuthProvider>
    <>
      <div className='flex flex-col min-h-screen'>
        <NavBar />
        <main className="flex-grow flex items-center justify-center ">
          <Routes>
          <Route path="/" element={<PrivateRoute><HomePage/></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
         
          </Routes>
        </main>
        <Footer />
      </div>
    </>
    </AuthProvider>
  );
};

export default App;
