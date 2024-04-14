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

    const { register, handleSubmit, formState: { errors } } = useForm()
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
    { console.log("change",errors) }
    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
                <div className="mb-4">
                    <label className="block mb-1">Name</label>
                    <input {...register("name", { required: "Name is required", minLength: 3, })} className="border p-2 w-full" />
                    {errors.name && <p role="alert">{errors.name.message}</p>}
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Email</label>
                    <input {...register("mail", { required: "Email is required", })}  className="border p-2 w-full"  aria-invalid={errors.mail ? "true" : "false"}/>
                    {errors.mail && <p role="alert">{errors.mail.message}</p>}
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Password</label>
                    <input {...register("password", { required: "Password is required with minumum six characters", minLength: 6 })} className="border p-2 w-full" />
                    {errors.password && <p role="alert">{errors.password.message}</p>}
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Confirm Password</label>
                    <input {...register("cPassword", { required: "Password is required with minumum six characters", minLength: 6 })} className="border p-2 w-full" />
                    {errors.cPassword && <p role="alert">{errors.cPassword.message}</p>}
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Register</button>
            </form>
        </div>
    );
};

export default Register;
