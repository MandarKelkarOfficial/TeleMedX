import React from "react";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa"; // Importing icons

const Footer = () => {
  return (
    <div className="w-screen bg-gray-100 py-10 mt-40 rounded-lg shadow-md">
      <div className="w-full max-w-7xl mx-auto flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 text-sm px-6 md:px-12">

        {/* Brand Info */}
        <div>
          <h1 className="text-2xl font-bold text-blue-900 mb-3">TeleMedX</h1>
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Your trusted telemedicine partner. Providing seamless online doctor consultations and healthcare services at your convenience.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <p className="text-xl font-medium mb-5 text-gray-800">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li className="hover:text-blue-600 cursor-pointer">Home</li>
            <li className="hover:text-blue-600 cursor-pointer">About Us</li>
            <li className="hover:text-blue-600 cursor-pointer">Delivery</li>
            <li className="hover:text-blue-600 cursor-pointer">Privacy Policy</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <p className="text-xl font-medium mb-5 text-gray-800">GET IN TOUCH</p>
          <ul className="flex flex-col gap-3 text-gray-600">
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-blue-600" /> +91 7620594657
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-blue-600" /> ketkar.ashwin@gmail.com
            </li>
          </ul>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="w-screen border-t border-gray-300 mt-10 pt-5 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} TeleMedX. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
