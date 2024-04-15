import React from 'react'
import { isAuthenticated, logout } from '../authentication/authService'
import { useNavigate, useLocation } from 'react-router-dom';



function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleButtonClick = () => {
        if (isAuthenticated()) { logout() }
        else {
            switch (location.pathname) {
                case '/login':
                    navigate('/register')
                    break;
                case '/register':
                    navigate('/login')
                    break;

                default:
                    break;
            }
        }

    }

    const handleButtonName = () => {
        if (isAuthenticated()) { return "Sign Out" }
        else {
            switch (location.pathname) {
                case '/login':
                   return "Register"
                case '/register':
                    return "Login"
                default:
                    break;
            }
        }

    }

    { console.log("isAuthenticated", isAuthenticated) }
    return (
        <nav class="bg-gray-800">
            <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div class="relative flex h-16 items-center justify-end">
                    <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                        onClick={handleButtonClick}>
                        <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
                        <span>{handleButtonName()}</span>
                    </button>
                </div>
            </div>



        </nav>
    )
}

export default NavBar