import React from "react";
import { isAuthenticated, logout } from "../authentication/authService";
import { useNavigate, useLocation } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleButtonClick = () => {
    if (isAuthenticated()) {
      logout();
      navigate("/login");
    } else {
      switch (location.pathname) {
        case "/login":
          navigate("/register");
          break;
        case "/register":
          navigate("/login");
          break;

        default:
          navigate("/login");
          break;
      }
    }
  };

  const handleButtonName = () => {
    if (isAuthenticated()) {
      return "Sign Out";
    } else {
      switch (location.pathname) {
        case "/login":
          return "Register";
        case "/register":
          return "Login";
        default:
          break;
      }
    }
  };

  return (
    <nav class="bg-gray-800">
      <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div class="relative flex h-16 items-center justify-end">
          <button
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
            onClick={handleButtonClick}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 4.5L17.5 12L6 19.5z" fill="#000000" />
            </svg>

            <span>{handleButtonName()}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
