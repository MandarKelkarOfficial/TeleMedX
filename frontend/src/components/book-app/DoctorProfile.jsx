// import React from "react";

// const DoctorProfile = ({ docInfo }) => {
//   return (
//     <div className="relative flex items-center gap-3">
//       {/* Small Circular Profile Image */}
//       <div className="group relative">
//         <img
//           className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
//           src={docInfo.image}
//           alt="Doctor"
//         />
//         {/* <p className="text-lg font-semibold text-gray-800 mt-2">{docInfo.name}</p> */}


//         {/* Hover for Full Info */}
//         <div className="absolute left-0 mt-2 w-64 bg-white p-4 rounded-lg shadow-lg text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
//           <p className="text-lg font-semibold">{docInfo.name}</p>
//           <p className="text-sm text-gray-500">{docInfo.specialization}</p>
//           <p className="text-sm">Experience: {docInfo.experience}</p>
//           <p className="text-sm">
//             Location: {docInfo.address.line1}, {docInfo.address.line2}
//           </p>

//         </div>
//       </div>

//       {/* Doctor Name */}
//       <p className="text-md font-medium text-gray-800">{docInfo.name}</p>
//     </div>
//   );
// };

// export default DoctorProfile;
// import React from "react";
// import { assets } from "../../assets/assets";

// const DoctorProfile = ({ docInfo, showSlots, currencySymbol }) => {
//   if (!docInfo) return null;

//   return (
//     <div className="flex transition-all duration-300 ease-in-out">
//       <div
//         className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out ${showSlots ? "w-24 p-4" : "w-72 p-6"
//           }`}
//       >
//         <div
//           className={`flex ${showSlots ? "items-center justify-center" : "flex-col items-center"
//             } gap-4`}
//         >
//           {/* Doctor Image */}
//           <img
//             className={`rounded-full border-4 border-blue-500 object-cover transition-all duration-300 ${showSlots ? "w-16 h-16" : "w-32 h-32"
//               }`}
//             src={docInfo.image || "/default-doctor.png"} // Default image fallback
//             alt={docInfo.name || "Doctor"}
//           />
//         </div>

//         {/* Doctor Details (Only shown when showSlots is false) */}
//         {!showSlots && (
//           <div className="mt-6 border border-[#ADADAD] rounded-lg p-4 bg-white">
//             {/* Doctor Name & Verified Icon */}
//             <p className="flex items-center gap-2 text-2xl font-medium text-gray-700">
//               {docInfo.name}
//               <img className="w-5" src={assets.verified_icon} alt="Verified" />
//             </p>

//             {/* Degree & Specialization */}
//             <div className="flex items-center gap-2 mt-1 text-gray-600">
//               <p>{docInfo.degree} - {docInfo.speciality}</p>
//               <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button>
//             </div>

//             {/* About Doctor */}
//             <p className="text-sm text-gray-600 max-w-[250px] mt-2">{docInfo.about}</p>

//             {/* Appointment Fee */}
//             <p className="text-gray-600 font-medium mt-4">
//               Appointment fee:
//               <span className="text-gray-800"> {currencySymbol}{docInfo.fees}</span>
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DoctorProfile;
import React from "react";
import { assets } from "../../assets/assets";

const DoctorProfile = ({ docInfo, showSlots, currencySymbol }) => {
  if (!docInfo) return null;

  return (
    <div className="bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col h-full w-full p-4 md:p-6 rounded-lg">
      {/* Doctor Image & Name */}
      <div className={`flex items-center ${showSlots ? "justify-center" : "flex-col"} gap-4`}>
        <img
          className={`rounded-full border-4 border-blue-500 object-cover transition-all duration-300 
            ${showSlots ? "w-16 h-16 md:w-20 md:h-20" : "w-24 h-24 md:w-32 md:h-32"}`}
          src={docInfo.image || "/default-doctor.png"}
          alt={docInfo.name || "Doctor"}
        />

        {/* Name & Verified Icon */}
        {!showSlots && (
          <div className="text-center md:text-left">
            <p className="flex items-center gap-2 text-lg md:text-2xl font-medium text-gray-700">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="Verified" />
            </p>
            <p className="text-gray-600 text-sm md:text-base">{docInfo.degree} - {docInfo.speciality}</p>
          </div>
        )}
      </div>

      {/* Doctor Details (Hidden when showSlots is true) */}
      {!showSlots && (
        <div className="mt-4 border border-gray-300 rounded-lg p-3 md:p-4 bg-white">
          {/* Experience & About */}
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <button className="py-1 px-2 border text-xs rounded-full">{docInfo.experience}</button>
          </div>
          <p className="text-sm text-gray-600 max-w-full md:max-w-[250px] mt-2">{docInfo.about}</p>

          {/* Appointment Fee */}
          <p className="text-gray-600 font-medium mt-4">
            Appointment fee: <span className="text-gray-800"> {currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;

