// Login.js
import React, { useState } from 'react';

import axios from 'axios';

const Login = () => {


  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://good-monday-js-test.vercel.app/users/login', formData);
      
      // Store JWT token in local storage
      localStorage.setItem('token', response.data.token);
      
      // Redirect user to home page
      //history.push('/');
    } catch (error) {
      console.error('Login error:', error.response.data);
      alert(error.response.data.error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="max-w-sm">
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="border p-2 w-full" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} className="border p-2 w-full" />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default Login;
