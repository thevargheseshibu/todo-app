// Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from "react-hook-form"

const Register = ({ history }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { register, handleSubmit } = useForm()
  const onSubmit = (data) => console.log(data)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Perform frontend validation
//       if (formData.password.length < 6) {
//         alert('Password must be at least 6 characters long');
//         return;
//       }
      
//       // Make POST request to register user
//       const response = await axios.post('https://good-monday-js-test.vercel.app/users', formData);
      
//       // Store JWT token in local storage
//       localStorage.setItem('token', response.data.token);
      
//       // Redirect user to home page
//       history.push('/');
//     } catch (error) {
//       console.error('Registration error:', error.response.data);
//       alert(error.response.data.error);
//     }
//   };
{console.log("change")}
  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input {...register("name")}  className="border p-2 w-full" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input {...register("email")} className="border p-2 w-full" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input {...register("password")} className="border p-2 w-full" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Confirm Password</label>
          <input {...register("cPassword")} className="border p-2 w-full" />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Register</button>
      </form>
    </div>
  );
};

export default Register;
