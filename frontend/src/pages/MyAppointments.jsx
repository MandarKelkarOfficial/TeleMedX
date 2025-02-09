import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const MyAppointments = () => {
    const { backendUrl, token } = useContext(AppContext);
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [payment, setPayment] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
    const slotDateFormat = (slotDate) => {
        console.log("Raw slotDate:", slotDate);

        let dateArray;
        if (slotDate.includes("-")) {
            const [year, month, day] = slotDate.split("-");
            dateArray = [day, month, year];
        } else {
            dateArray = slotDate.split('_')
        }

        //console.log(dateArray + "helloooo")
        return dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2]
    }
    // const formatDate = (slotDate) => {
    //     try {
    //         const [day, month, year] = slotDate.split("_");
    //         if (!day || !month || !year) throw new Error("Invalid date format");
    //         return `${day} ${months[Number(month)]} ${year}`;
    //     } catch (error) {
    //         console.error("Error formatting date:", error);
    //         return "Invalid date";
    //     }
    // };

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
                headers: { token },
            });
            setAppointments(data.appointments.reverse());
        } catch (error) {
            console.log(error);
            if (error.response?.status === 401) {
                toast.error("Session expired. Please log in again.");
                navigate("/login");
            } else {
                toast.error("Failed to fetch appointments.");
            }
        } finally {
            setLoading(false);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        if (window.confirm("Are you sure you want to cancel this appointment?")) {
            try {
                const { data } = await axios.post(
                    `${backendUrl}/api/user/cancel-appointment`,
                    { appointmentId },
                    { headers: { token } }
                );
                data.success ? toast.success(data.message) : toast.error(data.message);
                fetchAppointments();
            } catch (error) {
                console.log(error);
                toast.error("Error canceling appointment.");
            }
        }
    };

    const initPayment = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "TeleMedX - Appointment Payment",
            description: "Secure online payment",
            order_id: order.id,
            handler: async (response) => {
                try {
                    const { data } = await axios.post(
                        `${backendUrl}/api/user/verifyRazorpay`,
                        response,
                        { headers: { token } }
                    );
                    if (data.success) {
                        navigate("/my-appointments");
                        fetchAppointments();
                    }
                } catch (error) {
                    console.log(error);
                    toast.error("Payment verification failed.");
                }
            },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

  const payWithRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-razorpay`,
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        initPayment(data.order);
      } else {
        toast.error(data.message || "Razorpay payment failed.");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Razorpay payment failed.");
    }
};

  const payWithStripe = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-stripe`,
        { appointmentId },
        { headers: { token } }
      );
      data.success
        ? (window.location.href = data.session_url)
        : toast.error(data.message);
    } catch (error) {
      console.log(error);
      toast.error("Stripe payment failed.");
}
  };

useEffect(() => {
    if (token) fetchAppointments();
}, [token]);

return (
    <div>
        <button
            onClick={() => navigate(-1)}
            className="mb-4 text-sm text-blue-600 hover:underline"
        >
            &larr; Back
        </button>
        <p className="pb-3 mt-12 text-lg font-medium text-gray-700 border-b">
            My Appointments
        </p>
        <div>
            {loading ? (
                <p className="text-center text-gray-500 mt-6">Loading appointments...</p>
            ) : appointments.length === 0 ? (
                <p className="text-center text-gray-500 mt-6">No appointments found.</p>
            ) : (
                appointments.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 border-b"
                    >
                        <img
                            className="w-36 h-36 object-cover rounded-lg bg-gray-100"
                            src={item.docData.image}
                            alt={item.docData.name}
                        />
                        <div className="flex-1 text-sm text-gray-600 space-y-2">
                            <p className="text-lg font-semibold text-gray-800">
                                {item.docData.name}
                            </p>
                            <p>{item.docData.speciality}</p>
                            <p className="font-medium text-gray-700">Address:</p>
                            <p>{item.docData.address.line1}</p>
                            <p>{item.docData.address.line2}</p>
                            <p>
                                <span className="font-medium text-gray-700">Date & Time:</span>{" "}
                                {slotDateFormat(item.slotDate)} | {item.slotTime}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 w-full sm:w-auto text-center">
                            {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && (
                                <button
                                    onClick={() => setPayment(item._id)}
                                    className="w-full sm:w-48 py-2 border rounded text-gray-700 hover:bg-blue-600 hover:text-white transition"
                                >
                                    Pay Online
                                </button>
                            )}
                            {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && (
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => payWithStripe(item._id)}
                                        className="w-full sm:w-48 py-2 border rounded flex items-center justify-center hover:bg-gray-100"
                                    >
                                        <img className="max-w-20 max-h-5" src={assets.stripe_logo} alt="Stripe" />
                                    </button>
                                    <button
                                        onClick={() => payWithRazorpay(item._id)}
                                        className="w-full sm:w-48 py-2 border rounded flex items-center justify-center hover:bg-gray-100"
                                    >
                                        <img className="max-w-20 max-h-5" src={assets.razorpay_logo} alt="Razorpay" />
                                    </button>
                                </div>
                            )}
                            {item.payment && !item.isCompleted && (
                                <button className="w-full sm:w-48 py-2 border rounded bg-green-100 text-green-700">
                                    Paid
                                </button>
                            )}
                            {item.isCompleted && (
                                <button className="w-full sm:w-48 py-2 border border-green-500 rounded text-green-500">
                                    Completed
                                </button>
                            )}
                            {!item.cancelled && !item.isCompleted && (
                                <button
                                    onClick={() => cancelAppointment(item._id)}
                                    className="w-full sm:w-48 py-2 border rounded text-red-600 hover:bg-red-600 hover:text-white transition"
                                >
                                    Cancel Appointment
                                </button>
                            )}
                            {item.cancelled && (
                                <button className="w-full sm:w-48 py-2 border border-red-500 rounded text-red-500">
                                    Appointment Cancelled
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
);
};

export default MyAppointments;