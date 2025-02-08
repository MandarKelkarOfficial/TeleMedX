import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const RecentlyBookedDoctors = () => {
    const navigate = useNavigate();
    const { backendUrl, token } = useContext(AppContext);
    const [recentlyBooked, setRecentlyBooked] = useState([]);
    const scrollRef = useRef(null);

    useEffect(() => {
        const getUserAppointments = async () => {
            try {
                const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } });
                
                // Extract unique recently booked doctors, sorted by latest booking
                const uniqueDoctors = [];
                const doctorMap = new Map();
                
                data.appointments.sort((a, b) => {
                    const dateA = new Date(a.slotDate.split('_').reverse().join('-'));
                    const dateB = new Date(b.slotDate.split('_').reverse().join('-'));
                    return dateB - dateA;
                }).forEach(appointment => {
                    if (!doctorMap.has(appointment.docData._id)) {
                        doctorMap.set(appointment.docData._id, true);
                        uniqueDoctors.push({
                            ...appointment.docData,
                            lastBooked: appointment.slotDate
                        });
                    }
                });
                
                setRecentlyBooked(uniqueDoctors.slice(0, 10));
            } catch (error) {
                console.error("Error fetching appointments:", error);
            }
        };

        if (token) {
            getUserAppointments();
        }
    }, [backendUrl, token]);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-[#262626] md:mx-10'>
            <h1 className='text-3xl font-medium'>Recently Booked Doctors</h1>
            <p className='sm:w-1/3 text-center text-sm'>Check out doctors recently booked by other patients.</p>
            <div className='relative w-full'>
                <button 
                    onClick={scrollLeft} 
                    className='absolute left-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-4 rounded-full shadow-lg opacity-90 hover:opacity-100 transition-all z-10'
                >
                    &#9664;
                </button>
                <div ref={scrollRef} className='w-full overflow-x-auto whitespace-nowrap flex gap-4 pt-5 px-10 sm:px-0 scrollbar-hide'>
                    {recentlyBooked.map((item, index) => (
                        <div 
                            onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} 
                            className='group border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 min-w-[250px]' 
                            key={index}
                        >
                            {/* Background effect on hover */}
                            <div className="bg-[#EAEFFF] group-hover:bg-gradient-to-r from-[#0D47A1] to-[#1976D2] transition-all duration-500">
                                <img className='w-full' src={item.image} alt={item.name} />
                            </div>
                            
                            <div className='p-4'>
                                <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
                                <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
                                <p className='text-gray-500 text-xs mt-1'>Last booked: {new Date(item.lastBooked.split('_').reverse().join('-')).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button 
                    onClick={scrollRight} 
                    className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-4 rounded-full shadow-lg opacity-90 hover:opacity-100 transition-all z-10'
                >
                    &#9654;
                </button>
            </div>
        </div>
    );
};

export default RecentlyBookedDoctors;
