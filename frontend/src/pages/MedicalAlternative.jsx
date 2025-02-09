import { useState, useEffect } from "react";
import axios from "axios";
import Medicine_Details from "../../Medicine_Details.json";

const MedicineAlt = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [foundMedicines, setFoundMedicines] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [alternatives, setAlternatives] = useState({});
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

    if (!term.trim()) {
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

  const handlePdfUpload = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const getMedicineInfo = (medicineName) => {
    return medicines.find(
      (med) => med["Medicine Name"].toLowerCase() === medicineName.toLowerCase()
    );
  };

  const handleSubmit = async () => {
    if (!pdfFile) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", pdfFile);

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/upload_pdf", formData);

      if (response.data && Object.keys(response.data).length > 0) {
        const alternativesWithImages = {};
        Object.entries(response.data).forEach(([medName, alts]) => {
          alternativesWithImages[medName] = alts.map((alt) => ({
            ...alt,
            ...getMedicineInfo(alt["Medicine Name"]) || {}, // Add additional info if available
          }));
        });

        setAlternatives(alternativesWithImages);
      } else {
        setAlternatives({});
        console.warn("No alternative medicines found.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-10 p-8 bg-white shadow-xl rounded-lg">
      {/* Medicine Search */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Enter medicine names separated by commas..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full md:w-2/3 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Search Results */}
      {foundMedicines.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {foundMedicines.map((medicine, index) => (
            <MedicineCard key={index} medicine={medicine} />
          ))}
        </div>
      )}

      {/* PDF Upload */}
      <div className="mt-8 p-5 bg-gray-100 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">
          Upload PDF Prescription for Alternatives
        </h3>
        <input
          type="file"
          accept="application/pdf"
          onChange={handlePdfUpload}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSubmit}
          className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
        >
          Get Alternatives
        </button>
        {loading && <p className="text-center mt-4 text-blue-500">Processing...</p>}
      </div>

      {/* Display Alternatives */}
      {Object.keys(alternatives).length > 0 && (
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-blue-700 mb-6">Suggested Alternatives</h3>
          {Object.entries(alternatives).map(([originalMed, alts]) => (
            <div key={originalMed} className="mb-8">
              <h4 className="text-xl font-semibold text-gray-700 mb-4">
                Alternatives for: {originalMed}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {alts.map((alt, index) => (
                  <MedicineCard 
                    key={index} 
                    medicine={alt}
                    extraInfo={{
                      "Match %": `${alt.composition_match?.toFixed(1) || 0}%`,
                      "Review Score": alt.final_score?.toFixed(1) || 0
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const MedicineCard = ({ medicine, extraInfo }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-5 hover:shadow-2xl transition">
      <img
        src={medicine["Image URL"] || "fallback-image-url.jpg"}
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
        
        {extraInfo && (
          <div className="mt-2 space-y-1">
            {Object.entries(extraInfo).map(([label, value]) => (
              <p key={label} className="text-sm">
                <span className="font-medium">{label}:</span> {value}
              </p>
            ))}
          </div>
        )}

        <div className="mt-2">
          <p className="font-medium text-gray-700">Uses:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {medicine.Uses?.split(/(?=[A-Z])/).map((use, index) => (
              <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs">
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
  );
};

export default MedicineAlt;
