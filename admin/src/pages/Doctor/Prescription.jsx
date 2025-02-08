import { useState, useContext } from "react";
import { Button, Form, Row, Col, Card } from "react-bootstrap";
import Select from "react-select";
import jsPDF from "jspdf";
import "bootstrap/dist/css/bootstrap.min.css";
import { DoctorContext } from "../../context/DoctorContext";
import { useNavigate } from "react-router-dom";
// import medicinesList from "./MedicineList";
import medicinesList from "./MedicineList";

// const medilist = require('../../Medicine_list.json');
// import 

// import logo from "../../assets/assets";

// Medicine list with only the basic parameters.
const MedicinesList = medicinesList;

// Options for the frequency dropdown.
const frequencyOptions = [
  { value: "Once a day", label: "Once a day" },
  { value: "Twice a day", label: "Twice a day" },
  { value: "Thrice a day", label: "Thrice a day" },
  { value: "Every 6 hours", label: "Every 6 hours" },
  { value: "Every 8 hours", label: "Every 8 hours" },
];

const PrescriptionGenerator = () => {
  const navigate = useNavigate();

  const { dToken, appointments } = useContext(DoctorContext);

  const [patientName, setPatientName] = useState("");
  const [validityDate, setValidityDate] = useState("");
  // medicineDetails holds the list of selected medicines with extra fields.
  const [medicineDetails, setMedicineDetails] = useState([]);

  // When medicines are selected, merge them with any already-entered values.
  const handleMedicineChange = (selectedOptions) => {
    let newDetails = [];
    if (selectedOptions) {
      newDetails = selectedOptions.map((medicine) => {
        const existing = medicineDetails.find(
          (item) => item.value === medicine.value
        );
        return {
          ...medicine,
          dose: existing ? existing.dose : medicine.dose || "",
          timing: existing ? existing.timing : medicine.timing || "",
          frequency: existing ? existing.frequency : "", // Default empty
          duration: existing ? existing.duration : "", // Default empty
        };
      });
    }
    setMedicineDetails(newDetails);
  };

  // Handler to update a specific field (dose, timing, frequency, or duration)
  const handleMedicineFieldChange = (index, field, value) => {
    const updatedDetails = [...medicineDetails];
    updatedDetails[index][field] = value;
    setMedicineDetails(updatedDetails);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const patientPhone = "+1234567890";
    const patientID = "P12345";
    const visitDate = new Date().toLocaleDateString();
    const visitNumber = 5;
    const doctorAdvice = "Follow a healthy diet and stay hydrated.";
    const nextVisit = "2 weeks";

    // // --- Header Section ---
    // const logoWidth = 30;
    // const logoHeight = 30;
    // if (logo.p_logo) {
    //   doc.addImage(logo.p_logo, 'SVG', 10, 10, logoWidth, logoHeight);
    // }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Maddys Hospital", 50, 15);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Dr. Maddy K", 50, 25);
    doc.text("Contact: +1234567890", 50, 30);
    doc.text("Email: Maddy@example.com", 50, 35);
    doc.text("Clinic Contact: +0987654321", 50, 40);

    // --- Patient Information ---
    doc.setLineWidth(0.5);
    doc.line(10, 45, doc.internal.pageSize.getWidth() - 10, 45);
    let yOffset = 55;
    doc.setFont("helvetica", "bold");
    doc.text("Patient Information", 10, yOffset);
    yOffset += 5;
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${patientName || "N/A"}`, 10, (yOffset += 5));
    doc.text(`Phone: ${patientPhone}`, 10, (yOffset += 5));
    doc.text(`ID: ${patientID}`, 10, (yOffset += 5));
    doc.text(`Visit Date: ${visitDate}`, 10, (yOffset += 5));
    doc.text(`#Visit: ${visitNumber}`, 10, (yOffset += 5));
    doc.text(`Validity: ${validityDate || "N/A"}`, 10, (yOffset += 5));

    // --- Separator ---
    yOffset += 5;
    doc.line(10, yOffset, doc.internal.pageSize.getWidth() - 10, yOffset);
    yOffset += 10;

    // --- Medicines Section ---
    doc.setFont("helvetica", "bold");
    doc.text("Medicines Prescribed", 10, yOffset);
    yOffset += 10;
    // Table header for the medicines list.
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Medicine", 10, yOffset);
    doc.text("Dose", 50, yOffset);
    doc.text("Timing", 80, yOffset);
    doc.text("Frequency", 110, yOffset);
    doc.text("Duration", 150, yOffset);
    yOffset += 5;
    doc.setFont("helvetica", "normal");

    if (medicineDetails.length > 0) {
      medicineDetails.forEach((medicine) => {
        doc.text(medicine.label || "N/A", 10, yOffset);
        doc.text(medicine.dose || "N/A", 50, yOffset);
        doc.text(medicine.timing || "N/A", 80, yOffset);
        doc.text(medicine.frequency || "N/A", 110, yOffset);
        doc.text(medicine.duration || "N/A", 150, yOffset);
        yOffset += 6;
        if (yOffset > 270) {
          doc.addPage();
          yOffset = 20;
        }
      });
    } else {
      doc.text("No medicines prescribed.", 10, yOffset);
      yOffset += 10;
    }

    // --- Advice Section ---
    yOffset += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Advice:", 10, yOffset);
    doc.setFont("helvetica", "normal");
    yOffset += 5;
    doc.text(doctorAdvice, 10, yOffset);

    // --- Footer Section ---
    yOffset += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Follow-Up Details", 10, yOffset);
    doc.setFont("helvetica", "normal");
    yOffset += 5;
    doc.text(`Next Visit: ${nextVisit}`, 10, yOffset);
    yOffset += 10;
    doc.setFont("helvetica", "italic");
    doc.text("Powered by TelemedX", 10, yOffset);

    doc.save("prescription.pdf");
  };

  return (
    <div className="container mt-4">
      <h2>Prescription Generator</h2>
      <Form>
        {/* Patient Name & Validity Date */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="patientName">
              <Form.Label>Patient Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter patient's name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="validityDate">
              <Form.Label>Prescription Validity Date</Form.Label>
              <Form.Control
                type="date"
                value={validityDate}
                onChange={(e) => setValidityDate(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Medicine selection */}
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="medicineSelect">
              <Form.Label>Select Medicines</Form.Label>
              <Select
                isMulti
                options={MedicinesList}
                onChange={handleMedicineChange}
                placeholder="Select medicine(s)..."
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Dynamic fields for each selected medicine */}
        {medicineDetails.map((medicine, index) => (
          <Card key={medicine.value} className="mb-3">
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Medicine</Form.Label>
                    <Form.Control type="text" value={medicine.label} readOnly />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Dose</Form.Label>
                    <Form.Control
                      type="text"
                      value={medicine.dose}
                      onChange={(e) =>
                        handleMedicineFieldChange(index, "dose", e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Timing</Form.Label>
                    <Form.Control
                      type="text"
                      value={medicine.timing}
                      onChange={(e) =>
                        handleMedicineFieldChange(
                          index,
                          "timing",
                          e.target.value
                        )
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Frequency</Form.Label>
                    <Form.Control
                      as="select"
                      value={medicine.frequency}
                      onChange={(e) =>
                        handleMedicineFieldChange(
                          index,
                          "frequency",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select frequency</option>
                      {frequencyOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Duration</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., 5 days"
                      value={medicine.duration}
                      onChange={(e) =>
                        handleMedicineFieldChange(
                          index,
                          "duration",
                          e.target.value
                        )
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))}
        <div className="flex flex-col items-center w-full gap-3">
          <Button variant="primary" className="w-full" onClick={generatePDF}>
            Generate Prescription
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => navigate("/doctor-appointments")}
          >
            Go Back
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PrescriptionGenerator;
