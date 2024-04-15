// Login.js
import React, { useEffect, useState ,useContext} from 'react';

import axios from 'axios';
import { useForm } from "react-hook-form"
import { login ,isAuthenticated as tokenVerify} from './authentication/authService';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './authentication/authContext';

const Login = () => {


    const { register, handleSubmit, formState: { errors } } = useForm()
    const navigate = useNavigate();
    const {isAuthenticated,setAuthenticated} = useContext(AuthContext);

    useEffect(()=>{
        isAuthenticated?.isAuthenticated &&  navigate('/'); 
    },[])

    const onSubmit = async (data) => {

        try {
            const response = await axios.post('https://good-monday-js-test.vercel.app/users/login', data);
            console.log("response", response)
            // Store JWT token in local storage
            login(response?.data?.token);
            setAuthenticated(tokenVerify())
            navigate('/'); 

            // Redirect user to home page

        } catch (error) {
            console.error('Registration error:', error);
            alert(error?.response?.data.errors[0]?.message||error);
        }
    };

    return (
        <div className=" h-96 w-96 ">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
                <div className="mb-4">
                    <label className="block mb-1">Email</label>
                    <input {...register("email", { required: "Email is required", })} className="border p-2 w-full" />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Password</label>
                    <input type="password" {...register("password", { required: true })} className="border p-2 w-full" />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
            </form>
        </div>
    );
};

export default Login;
