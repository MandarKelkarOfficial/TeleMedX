import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import AvailableSlots from '../components/book-app/AvailableSlots';

const Appointment = () => {
    const { docId } = useParams();
    const { doctors, currencySymbol, backendUrl, token, getDoctosData } = useContext(AppContext);
    const [docInfo, setDocInfo] = useState(null);
    const [showSlots, setShowSlots] = useState(false);

    useEffect(() => {
        if (doctors.length > 0) {
            const foundDoc = doctors.find((doc) => doc._id === docId);
            setDocInfo(foundDoc);
        }
    }, [doctors, docId]);

    return docInfo ? (
        <div>
            {/* Doctor Details - Minimized if slots are shown */}
            <div className={`flex ${showSlots ? 'items-center gap-4' : 'flex-col sm:flex-row gap-4'}`}>
                {!showSlots && (
                    <img className='bg-gradient-to-r from-[#0D47A1] to-[#1976D2] w-24 h-24 sm:w-72 sm:h-auto rounded-lg' src={docInfo.image} alt="Doctor" />
                )}
                
                {!showSlots && (
                    <div className='flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white'>
                        <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>
                            {docInfo.name} <img className='w-5' src={assets.verified_icon} alt="Verified" />
                        </p>
                        <div className='flex items-center gap-2 mt-1 text-gray-600'>
                            <p>{docInfo.degree} - {docInfo.speciality}</p>
                            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
                        </div>
                        <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{docInfo.about}</p>
                        <p className='text-gray-600 font-medium mt-4'>
                            Appointment fee: <span className='text-gray-800'>{currencySymbol}{docInfo.fees}</span>
                        </p>
                    </div>
                )}
            </div>

            {/* Centered Button to Show Slots */}
            {!showSlots && (
                <div className='flex justify-center mt-6'>
                    <button 
                        onClick={() => setShowSlots(true)}
                        className='bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white text-sm font-light px-6 py-3 rounded-full hover:scale-110 transition-all'>
                        Check Available Slots
                    </button>
                </div>
            )}

            {/* Available Slots Section */}
            {showSlots && <AvailableSlots docInfo={docInfo} token={token} backendUrl={backendUrl} getDoctorsData={getDoctosData} />}

            {/* Related Doctors */}
            <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
        </div>
    ) : null;
};

export default Appointment;
