// import { useState, useEffect } from "react";
// import axios from "axios";
// import Medicine_Details from "../../Medicine_Details.json"; // Import the JSON file

// const MedicineSearch = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [foundMedicines, setFoundMedicines] = useState([]);
//   const [medicines, setMedicines] = useState([]);
//   const [pdfFile, setPdfFile] = useState(null);
//   const [extractedData, setExtractedData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const cleanedMedicines = Medicine_Details.map((medicine) => ({
//       ...medicine,
//       "Image URL": medicine["Image URL"].replace(/\\/g, ""),
//     }));
//     setMedicines(cleanedMedicines);
//   }, []);

//   const handleSearch = (e) => {
//     const term = e.target.value.toLowerCase();
//     setSearchTerm(term);

//     if (term.trim() === "") {
//       setFoundMedicines([]);
//       return;
//     }

//     const searchTerms = term.split(",").map((t) => t.trim());

//     const results = medicines.filter((med) =>
//       searchTerms.some((term) =>
//         med["Medicine Name"].toLowerCase().includes(term)
//       )
//     );

//     setFoundMedicines(results);
//   };

//   const handlePdfUpload = async (e) => {
//     const file = e.target.files[0];
//     if (file && file.type === "application/pdf") {
//       setPdfFile(file);
//       setLoading(true);
//       const formData = new FormData();
//       formData.append("file", file);

//       try {
//         const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });
//         setExtractedData(response.data);
//       } catch (error) {
//         console.error("Error uploading file:", error);
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       alert("Please upload a valid PDF file.");
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto my-10 p-5">
//       {/* Medicine Search Section */}
//       <div className="flex justify-center">
//         <input
//           type="text"
//           placeholder="Enter medicine names separated by commas..."
//           value={searchTerm}
//           onChange={handleSearch}
//           className="w-full md:w-2/3 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       {foundMedicines.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
//           {foundMedicines.map((medicine, index) => (
//             <div
//               key={index}
//               className="bg-white rounded-xl shadow-lg p-5 hover:shadow-2xl transition"
//             >
//               <img
//                 src={medicine["Image URL"]}
//                 alt={medicine["Medicine Name"]}
//                 className="w-full h-40 object-cover rounded-t-lg"
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = "fallback-image-url.jpg";
//                 }}
//               />
//               <div className="p-4">
//                 <h3 className="text-xl font-semibold text-blue-700">
//                   {medicine["Medicine Name"]}
//                 </h3>
//                 <p className="text-gray-600 text-sm">{medicine.Manufacturer}</p>
//                 <div className="mt-2">
//                   <p className="font-medium text-gray-700">Uses:</p>
//                   <div className="flex flex-wrap gap-2 mt-1">
//                     {medicine.Uses.split(/(?=[A-Z])/).map((use, index) => (
//                       <span
//                         key={index}
//                         className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs"
//                       >
//                         {use.trim()}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//                 <p className="mt-2 text-gray-700">
//                   <strong>Composition:</strong> {medicine.Composition}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         searchTerm && (
//           <p className="text-center mt-6 text-red-500 font-medium">
//             No medicines found!
//           </p>
//         )
//       )}

//       {/* PDF Upload Section */}
//       <div className="mt-6">
//         <input
//           type="file"
//           accept="application/pdf"
//           onChange={handlePdfUpload}
//           className="px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         {loading && <p className="text-center mt-4">Uploading...</p>}
//         {extractedData && (
//           <div className="mt-6">
//             <h3 className="text-xl font-semibold text-blue-700">Extracted Data:</h3>
//             <pre className="bg-gray-100 p-4 rounded-lg">{JSON.stringify(extractedData, null, 2)}</pre>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MedicineSearch;




import { useState, useEffect } from "react";
import axios from "axios";
import Medicine_Details from "../../Medicine_Details.json"; // Import the JSON file

const MedicineSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [foundMedicines, setFoundMedicines] = useState([]);
  const [medicines, setMedicines] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [pdfFile, setPdfFile] = useState(null);
  const [medicineNames, setMedicineNames] = useState(""); // New state to hold the comma-separated medicine names
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cleanedMedicines = Medicine_Details.map((medicine) => ({
      ...medicine,
      "Image URL": medicine["Image URL"].replace(/\\/g, ""),
    }));
    setMedicines(cleanedMedicines);
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === "") {
      setFoundMedicines([]);
      return;
    }

    const searchTerms = term.split(",").map((t) => t.trim());
    const results = medicines.filter((med) =>
      searchTerms.some((term) =>
        med["Medicine Name"].toLowerCase().includes(term)
      )
    );

    setFoundMedicines(results);
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Extract the medicine names array from the response and join into a single string.
        const namesArray = response.data.medicine; // Assume this returns an array, e.g., ["Ibuprofen", "Amoxicillin"]
        const namesString = namesArray.join(", ");
        setMedicineNames(namesString);
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto my-10 p-5">
      {/* Medicine Search Section */}
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Enter medicine names separated by commas..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full md:w-2/3 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {foundMedicines.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {foundMedicines.map((medicine, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-5 hover:shadow-2xl transition"
            >
              <img
                src={medicine["Image URL"]}
                alt={medicine["Medicine Name"]}
                className="w-full h-40 object-cover rounded-t-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "fallback-image-url.jpg";
                }}
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-blue-700">
                  {medicine["Medicine Name"]}
                </h3>
                <p className="text-gray-600 text-sm">{medicine.Manufacturer}</p>
                <div className="mt-2">
                  <p className="font-medium text-gray-700">Uses:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {medicine.Uses.split(/(?=[A-Z])/).map((use, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs"
                      >
                        {use.trim()}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-gray-700">
                  <strong>Composition:</strong> {medicine.Composition}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        searchTerm && (
          <p className="text-center mt-6 text-red-500 font-medium">
            No medicines found!
          </p>
        )
      )}

      {/* PDF Upload Section */}
      <div className="mt-6">
        <input
          type="file"
          accept="application/pdf"
          onChange={handlePdfUpload}
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {loading && <p className="text-center mt-4">Uploading...</p>}
        {medicineNames && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-blue-700">
              Extracted Medicine Names:
            </h3>
            <p className="bg-gray-100 p-4 rounded-lg">{medicineNames}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineSearch;
