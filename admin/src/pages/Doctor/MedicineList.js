import medicinesData from "../../Medicine_Details.json"; // Import JSON file

// Transform JSON data to match react-select format
const medicinesList = medicinesData.map((med) => ({
  value: med["Medicine Name"],
  label: med["Medicine Name"],
  dose: med["Composition"].split("(")[1]?.split(")")[0] || "N/A", // Extract dose
}));

export default medicinesList;
