// Login.js
import React, { useEffect, useState ,useContext} from 'react';

import axios from 'axios';
import { useForm } from "react-hook-form"
import { login ,isAuthenticated as tokenVerify} from './authentication/authService';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './authentication/authContext';
import Spinner from './components/Spinner';
import { extractNameFromToken } from './utils/utility';
import { API_LOGIN } from './api/apiEndpoints';

const Login = () => {


    const { register, handleSubmit, formState: { errors } } = useForm()
    const navigate = useNavigate();
    const {isAuthenticated,setAuthenticated,setUserName} = useContext(AuthContext);
    const [spinner,setSpinner] = useState(false);

    useEffect(()=>{
        isAuthenticated?.isAuthenticated &&  navigate('/'); 
    },[])

    const onSubmit = async (data) => {

        setSpinner(true);
        try {
            const response = await axios.post(API_LOGIN, data);
            console.log("response", response)
            // Store JWT token in local storage
            login(response?.data?.token);
            setAuthenticated(tokenVerify())
            
            navigate('/'); 
            setSpinner(false);
            const token = response?.data?.token;

        
    
            setUserName(extractNameFromToken(token))

            // Redirect user to home page

        } catch (error) {
            console.error('Registration error:', error);
            alert(error?.response?.data.errors[0]?.message||error);
            setSpinner(false);
        }
    };

    return (spinner?<Spinner/>:
        <div className=" h-96 w-96 ">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
                <div className="mb-4">
                    <label className="block mb-1">Email</label>
                    <input {...register("email", { required: "Email is required",  pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address"
    }})} className="border p-2 w-full" />
       {errors.email && <p role="alert" className='text-red-700'>{errors.email.message}</p>}
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Password</label>
                    <input type="password" {...register("password", { required: "Password is required"})} className="border p-2 w-full" />
                </div>
                {errors.password && <p role="alert" className='text-red-700'>{errors.password.message}</p>}
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
            </form>
        </div>
    );
};

export default Login;
