// Register.js
import React, { useState,useEffect,useContext } from 'react';
import axios from 'axios';
import { useForm } from "react-hook-form"
import { login ,isAuthenticated as tokenVerify} from './authentication/authService';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './authentication/authContext';

const Register = ({ history }) => {
  
    const { register, handleSubmit, formState: { errors } } = useForm()
    const navigate = useNavigate();
    const {isAuthenticated,setAuthenticated} = useContext(AuthContext);

    useEffect(()=>{
        isAuthenticated?.isAuthenticated &&  navigate('/'); 
    },[])
    
    // const onSubmit = (data) => console.log(data)

    const onSubmit = async (data) => { ///check baout e.prevent default
     
        const requestData={...data}
        delete requestData.cPassword;
    

        try {
            const response = await axios.post('https://good-monday-js-test.vercel.app/users', requestData);
          console.log("response",response)
            // Store JWT token in local storage
            login(response?.data?.token);
            setAuthenticated(tokenVerify())

            // Redirect user to home page
    
        } catch (error) {
            console.error('Registration error:', error);
            alert(error?.response?.data.errors[0]?.message||error);
        }
    };
    { console.log("change", errors) }
    return (
        <div className="h-96 w-96 mt-8">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
                <div className="mb-4">
                    <label className="block mb-1">Name</label>
                    <input {...register("name", { required: "Name is required", minLength: 3, })} className="border p-2 w-full" />
                    {errors.name && <p role="alert">{errors.name.message}</p>}
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Email</label>
                    <input {...register("email", { required: "Email is required", })} className="border p-2 w-full" aria-invalid={errors.email ? "true" : "false"} />
                    {errors.email && <p role="alert">{errors.email.message}</p>}
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Password</label>
                    <input type="password" {...register("password", { required: "Password is required with minumum six characters", minLength: 6 })} className="border p-2 w-full" />
                    {errors.password && <p role="alert">{errors.password.message}</p>}
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Confirm Password</label>
                    <input  type="password" {...register("cPassword", { required: "Password is required with minumum six characters", minLength: 6 })} className="border p-2 w-full" />
                    {errors.cPassword && <p role="alert">{errors.cPassword.message}</p>}
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Register</button>
            </form>
        </div>
    );
};

export default Register;
