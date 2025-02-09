//taken fully from gpt
import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });



  const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "674c6904-2c7b-4520-9dd4-776b09f8d6c8");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // const handleSubmit = (e) => {
  //   // e.preventDefault();
  //   // Simulate form submission here, like sending to an API or email service.
  //   console.log('Form Submitted:', formData);
  // };

  return (
    <div className="bg-gray-50 min-h-screen p-6 sm:p-10">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
        <p className="text-gray-600 mt-4">
          We'd love to hear from you! Please fill out the form below to get in touch.
        </p>
      </div>

      {/* Contact Form Section */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="sm:w-1/2">
            <h2 className="text-2xl font-semibold text-gray-800">Get in Touch</h2>
            <p className="text-gray-600 mt-3">
              Feel free to send us a message and we will get back to you as soon as possible.
            </p>
          </div>

          <div className="sm:w-1/2 bg-white p-8 rounded-lg shadow-lg">
            <form onSubmit={onSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your Name"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your Email"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your Message"
                  rows="6"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white rounded-lg hover:bg-gradient-to-r from-[#0D47A1] to-[#1976D2]-dark focus:outline-none"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
        <span>{result}</span>

        {/* Contact Information Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Our Contact Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800">Phone</h3>
              <p className="text-gray-600 mt-2">+91 9657237833</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800">Email</h3>
              <p className="text-gray-600 mt-2">veddeshpandepict@gmail.com</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800">Office Address</h3>
              <p className="text-gray-600 mt-2">123 Health Street, City, Country</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;