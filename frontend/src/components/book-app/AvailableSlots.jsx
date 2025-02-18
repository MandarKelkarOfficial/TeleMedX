import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DoctorProfile from "./DoctorProfile"; // Ensure import

const AvailableSlots = ({ docInfo, token, backendUrl, getDoctorsData }) => {
    const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState("");
    const [showSlots, setShowSlots] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (docInfo) {
            getAvailableSlots();
        }
    }, [docInfo]);

    // const getAvailableSlots = () => {
    //     setDocSlots([]); // Reset slots before fetching new ones

    //     let today = new Date();

    //     for (let i = 0; i < 7; i++) {
    //         let currentDate = new Date(today);
    //         currentDate.setDate(today.getDate() + i);

    //         let endTime = new Date();
    //         endTime.setDate(today.getDate() + i);
    //         endTime.setHours(21, 0, 0, 0);

    //         if (today.getDate() === currentDate.getDate()) {
    //             currentDate.setHours(
    //                 currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
    //             );
    //             currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
    //         } else {
    //             currentDate.setHours(10);
    //             currentDate.setMinutes(0);
    //         }

    //         let timeSlots = [];

    //         while (currentDate < endTime) {
    //             let formattedTime = currentDate.toLocaleTimeString([], {
    //                 hour: "2-digit",
    //                 minute: "2-digit",
    //             });

    //             //let slotDate = `${currentDate.getDate()}_${currentDate.getMonth() + 1}_${currentDate.getFullYear()}`;
    //             let day = currentDate.getDate();
    //             let month = currentDate.getMonth() + 1;
    //             let year = currentDate.getFullYear();
    //             const slotDate = `${ day }${ month }${ year }`;
    //             const slotTime = formattedTime;

    //             const bookings =
    //                 docInfo.slots_booked?.[slotDate]?.filter((time) => time === formattedTime).length || 0;
    //             const isSlotAvailable = bookings < 2;

    //             if (isSlotAvailable) {
    //                 timeSlots.push({ datetime: new Date(currentDate), time: formattedTime });
    //             }

    //             currentDate.setMinutes(currentDate.getMinutes() + 30);
    //         }

    //         setDocSlots((prev) => [...prev, timeSlots]);
    //     }
    // };

    // const bookAppointment = async (token) => {
    //     if (!token) {
    //         toast.warning("Login to book appointment");
    //         console.log(token)
    //         return navigate("/login");
    //     }

    //     // if (!slotTime) {
    //     //     toast.warning("Select a slot to book");
    //     //     return;
    //     // }

    //     // const date = docSlots[slotIndex][0].datetime;
    //     // const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;

    //     const date = docSlots[slotIndex][0].datetime;

    //     let day = date.getDate();
    //     let month = date.getMonth() + 1;
    //     let year = date.getFullYear();

    //     const slotDate = `${ day }${ month }${ year }`;

    //     try {
    //         // Checking if the slot is available on the server side
    //         const { data } = await axios.post(
    //             `${backendUrl}/api/user/book-appointment`,
    //             { docId: docInfo._id, slotDate, slotTime },
    //             { headers: { token } }
    //         );

    //         if (data.success) {
    //             toast.success(data.message);
    //             getDoctorsData(); // Fetch updated doctor data
    //             navigate("/my-appointments");
    //         } else {
    //             toast.error(data.message); // Handle any error messages
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         toast.error(error.message);
    //     }
    //     // try {
    //     //     const { data } = await axios.post(
    //     //         `${backendUrl}/api/user/book-appointment`,
    //     //         { docId: docInfo._id, slotDate, slotTime },
    //     //         { headers: { token } }
    //     //     );

    //     //     if (data.success) {
    //     //         toast.success(data.message);
    //     //         getDoctorsData(); // Fetch updated doctor data
    //     //         navigate("/my-appointments");
    //     //     } else {
    //     //         toast.error(data.message);
    //     //     }
    //     // } catch (error) {
    //     //     console.log(error);
    //     //     toast.error(error.message);
    //     // }
    // };
    const getAvailableSlots = () => {
        let today = new Date();
        let slotsArray = []; // Temporary array to hold slots

        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            let endTime = new Date();
            endTime.setDate(today.getDate() + i);
            endTime.setHours(21, 0, 0, 0);

            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() >= 10 ? currentDate.getHours() + 1 : 10);
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
            } else {
                currentDate.setHours(10);
                currentDate.setMinutes(0);
            }

            let timeSlots = [];

            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                });

                let day = currentDate.getDate();
                let month = currentDate.getMonth() + 1;
                let year = currentDate.getFullYear();
                const slotDate = `${day}_${month}_${year}`;

                const bookings =
                    docInfo.slots_booked?.[slotDate]?.filter((time) => time === formattedTime).length || 0;
                const isSlotAvailable = bookings < 2;

                if (isSlotAvailable) {
                    timeSlots.push({ datetime: new Date(currentDate), time: formattedTime });
                }

                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }

            slotsArray.push(timeSlots);
        }

        setDocSlots(slotsArray); // ✅ Update state once, after the loop
    };


    const bookAppointment = async () => {
        if (!token) {
            toast.warning("Login to book appointment");
            return navigate("/login");
        }

        if (!slotTime) {
            toast.warning("Select a slot to book");
            return;
        }

        //const date = docSlots[slotIndex][0].datetime;
        if (!docSlots[slotIndex] || docSlots[slotIndex].length === 0) {
            toast.warning("No available slots for this date.");
            return;
        }

        const date = docSlots[slotIndex][0].datetime;


        // Correcting date format
        const slotDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

        console.log("Sending Booking Request:", {
            docId: docInfo._id,
            slotDate,
            slotTime,
        });

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/book-appointment`,
                { docId: docInfo._id, slotDate, slotTime },
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                getDoctorsData();  // Fix function name
                navigate("/my-appointments"); // Redirect after successful booking
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Booking Error:", error);
            if (error.response) {
                console.error("Response Data:", error.response.data);
                console.error("Status Code:", error.response.status);
                console.error("Headers:", error.response.headers);
                toast.error(error.response.data.message || "Booking failed");
            } else if (error.request) {
                console.error("No Response Received:", error.request);
                toast.error("No response from server. Check your backend.");
            } else {
                console.error("Axios Error:", error.message);
                toast.error("An unexpected error occurred.");
            }
        }
    };


    // return (
    //     <>
    //     <div className="flex w-full h-full px-10 mt-2">
    //         {/* Sidebar (DoctorProfile) - Shifted Left */}
    //         <div className="w-80 flex-shrink-0 overflow-y-scroll">
    //             <DoctorProfile docInfo={docInfo} showSlots={showSlots} currencySymbol="₹" />
    //         </div>

    //         {/* Booking Slots Section */}
    //         <div className="flex-1 flex flex-col ml-8 h-full">
    //             <p className="text-xl font-semibold">Booking slots</p>
    //             <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
    //                 {docSlots.length > 0 &&
    //                     docSlots.map((item, index) => (
    //                         <div
    //                             key={index}
    //                             onClick={() => setSlotIndex(index)}
    //                             className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index
    //                                 ? "bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white"
    //                                 : "border border-[#DDDDDD]"
    //                                 }`}
    //                         >
    //                             <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
    //                             <p>{item[0] && item[0].datetime.getDate()}</p>
    //                         </div>
    //                     ))}
    //             </div>
    //             <div className="flex flex-wrap gap-3 items-center w-full mt-4">
    //                 {docSlots.length > 0 && docSlots[slotIndex] && docSlots[slotIndex].map((item, index) => {
    //                     const slotDate = `${item.datetime.getDate()}_${item.datetime.getMonth() + 1}_${item.datetime.getFullYear()}`;

    //                     const bookings =
    //                         docInfo.slots_booked?.[slotDate]?.filter((time) => time === item.time).length || 0;
    //                     const isSlotAvailable = bookings < 2;

    //                     return (
    //                         <p
    //                             key={index}
    //                             onClick={() => isSlotAvailable && setSlotTime(item.time)}
    //                             className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime
    //                                 ? "bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white"
    //                                 : isSlotAvailable
    //                                     ? "text-[#949494] border border-[#B4B4B4]"
    //                                     : "text-[#B4B4B4] bg-gray-300"
    //                                 }`}
    //                             style={{ pointerEvents: isSlotAvailable ? "auto" : "none" }}
    //                         >
    //                             {item.time.toLowerCase()}
    //                         </p>
    //                     );
    //                 })}
    //             </div>
    //         </div>
    //         {/* Appointment Button - Align to Right */}
    //         <div className="ml-auto flex items-center">
    //             <button onClick={bookAppointment} className="bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white px-6 py-4 rounded-full shadow-lg">
    //                 Book an appointment
    //             </button>
    //         </div>
    //     </div>
    //     </>
    // );
    return (
        <>
            <div className="flex flex-col md:flex-row w-full h-full px-4 md:px-10 mt-2">
                {/* Sidebar (DoctorProfile) - Full width on small screens, fixed width on larger screens */}
                <div className="w-full md:w-80 flex-shrink-0 overflow-y-scroll">
                    <DoctorProfile docInfo={docInfo} showSlots={showSlots} currencySymbol="₹" />
                </div>

                {/* Booking Slots Section - Full width on small screens, flex-1 on larger screens */}
                <div className="flex-1 flex flex-col md:ml-8 h-full mt-4 md:mt-0">
                    <p className="text-xl font-semibold">Booking slots</p>
                    <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
                        {docSlots.length > 0 &&
                            docSlots.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSlotIndex(index)}
                                    className={`text-center py-6 min-w-16 rounded-full hover:scale-105 transition-all cursor-pointer ${slotIndex === index
                                            ? "bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white"
                                            : "border border-[#DDDDDD]"
                                        }`}
                                >
                                    <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                                    <p>{item[0] && item[0].datetime.getDate()}</p>
                                </div>
                            ))}
                    </div>
                    <div className="flex flex-wrap gap-3 items-center w-full mt-4">
                        {docSlots.length > 0 &&
                            docSlots[slotIndex] &&
                            docSlots[slotIndex].map((item, index) => {
                                const slotDate = `${item.datetime.getDate()}_${item.datetime.getMonth() + 1}_${item.datetime.getFullYear()}`;

                                const bookings =
                                    docInfo.slots_booked?.[slotDate]?.filter((time) => time === item.time).length || 0;
                                const isSlotAvailable = bookings < 2;

                                return (
                                    <p
                                        key={index}
                                        onClick={() => isSlotAvailable && setSlotTime(item.time)}
                                        className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full hover:scale-105 transition-all cursor-pointer ${item.time === slotTime
                                                ? "bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white"
                                                : isSlotAvailable
                                                    ? "text-[#949494] border border-[#B4B4B4]"
                                                    : "text-[#B4B4B4] bg-gray-300"
                                            }`}
                                        style={{ pointerEvents: isSlotAvailable ? "auto" : "none" }}
                                    >
                                        {item.time.toLowerCase()}
                                    </p>
                                );
                            })}
                    </div>
                </div>

                {/* Appointment Button - Full width on small screens, auto margin on larger screens */}
                <div className="w-full md:w-auto md:ml-auto flex items-center mt-4 md:mt-0">
                    <button
                        onClick={bookAppointment}
                        className="w-full md:w-auto bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white px-6 py-4 rounded-full hover:scale-105 transition-all shadow-lg"
                    >
                        Book an appointment
                    </button>
                </div>
            </div>
        </>
    );
};
export default AvailableSlots