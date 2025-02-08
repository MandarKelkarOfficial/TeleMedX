import React, { useState, useContext } from "react";
import { assets } from "../assets/assets";
import logo from "../assets/main_logo.png"
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";

const Navbar = () => {
  const navigate = useNavigate();

  const { token, setToken } = useContext(AppContext)

  const [showMenu, setShowMenu] = useState(false);

  const logout = () => {
    setToken(false)
    localStorage.removeItem('token')

  }


  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={logo}
        alt=""
      />
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `relative px-4 py-2 text-lg font-semibold transition-all duration-300 
            ${isActive ? "text-blue-600 after:w-full" : "text-black hover:text-blue-600"} 
            after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-blue-600 
            after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/doctors"
          className={({ isActive }) =>
            `relative px-4 py-2 text-lg font-semibold transition-all duration-300 
            ${isActive ? "text-blue-600 after:w-full" : "text-black hover:text-blue-600"} 
            after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-blue-600 
            after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100`
          }
        >
          All Doctors
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `relative px-4 py-2 text-lg font-semibold transition-all duration-300 
            ${isActive ? "text-blue-600 after:w-full" : "text-black hover:text-blue-600"} 
            after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-blue-600 
            after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100`
          }
        >
          About
        </NavLink>
        
        <NavLink
          to="/my-health"
          className={({ isActive }) =>
            `relative px-4 py-2 text-lg font-semibold transition-all duration-300 
            ${isActive ? "text-blue-600 after:w-full" : "text-black hover:text-blue-600"} 
            after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-blue-600 
            after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100`
          }
        >
          Health
        </NavLink>
        
        <NavLink
          to="/my-health-search"
          className={({ isActive }) =>
            `relative px-4 py-2 text-lg font-semibold transition-all duration-300 
            ${isActive ? "text-blue-600 after:w-full" : "text-black hover:text-blue-600"} 
            after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-blue-600 
            after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100`
          }
        >
          MediView
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `relative px-4 py-2 text-lg font-semibold transition-all duration-300 
            ${isActive ? "text-blue-600 after:w-full" : "text-black hover:text-blue-600"} 
            after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-blue-600 
            after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100`
          }
        >
          Contact
        </NavLink>
      </ul>
      <div className="flex items-center gap-4">
        {token ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img
              className="w-8 h-8 rounded-full"
              src={assets.profile_pic}
              alt="Profile"
            />
            <img className="w-2.5" src={assets.dropdown_icon} />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-blue-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p
                  onClick={() => navigate("my-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("my-appointments")}
                  className="hover:text-black cursor-pointer"
                >
                  My Appointments
                </p>
                <p
                  onClick={logout}
                  className="hover:text-black cursor-pointer"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white px-8 py-3 rounded-full font-light hidden md:block"
          >
            Create Account
          </button>
        )}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
        />
        <div
          className={`${showMenu ? "fixed w-full" : "h-0 w-0"
            } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-36" src={assets.logo} alt="" />
            <img
              className="w-7"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt=""
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/"
              className={({ isActive }) =>
                `relative px-4 py-2 text-lg font-semibold transition-all duration-300 
                ${isActive ? "text-blue-600 after:w-full" : "text-black hover:text-blue-600"} 
                after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-blue-600 
                after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100`
              }
            >
              Home
            </NavLink>
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/doctors"
              className={({ isActive }) =>
                `relative px-4 py-2 text-lg font-semibold transition-all duration-300 
                ${isActive ? "text-blue-600 after:w-full" : "text-black hover:text-blue-600"} 
                after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-blue-600 
                after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100`
              }
            >
              All Doctors
            </NavLink>
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/about"
              className={({ isActive }) =>
                `relative px-4 py-2 text-lg font-semibold transition-all duration-300 
                ${isActive ? "text-blue-600 after:w-full" : "text-black hover:text-blue-600"} 
                after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-blue-600 
                after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100`
              }
            >
              About
            </NavLink>
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/my-health"
              className={({ isActive }) =>
                `relative px-4 py-2 text-lg font-semibold transition-all duration-300 
                ${isActive ? "text-blue-600 after:w-full" : "text-black hover:text-blue-600"} 
                after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-blue-600 
                after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100`
              }
            >
              Health
            </NavLink>
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/my-health-search"
              className={({ isActive }) =>
                `relative px-4 py-2 text-lg font-semibold transition-all duration-300 
                ${isActive ? "text-blue-600 after:w-full" : "text-black hover:text-blue-600"} 
                after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-blue-600 
                after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100`
              }
            >
              MediView
            </NavLink>
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/contact"
              className={({ isActive }) =>
                `relative px-4 py-2 text-lg font-semibold transition-all duration-300 
                ${isActive ? "text-blue-600 after:w-full" : "text-black hover:text-blue-600"} 
                after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-blue-600 
                after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100`
              }
            >
              Contact
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
