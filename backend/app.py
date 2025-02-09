from flask import Flask, request, jsonify
import pdfplumber
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


def extract_prescription_data(pdf_path):
    """Extracts medicine details from the given PDF file."""
    data_dict = {"medicine": [], "dose": [], "timing": [], "frequency": [], "duration": []}
    start_extracting = False
    first_row = True  # Flag to skip the first row (headers)

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if not text:
                continue
            lines = text.split("\n")

            for line in lines:
                if "Medicines Prescribed" in line:
                    start_extracting = True
                    continue

                if "Advice:" in line:
                    start_extracting = False
                    break

                if start_extracting:
                    words = line.split()

                    # Merge "After meals" into a single token
                    for i in range(len(words) - 1):
                        if words[i] == "After" and words[i + 1] == "meals":
                            words[i:i + 2] = ["After meals"]
                            break

                    # Merge duration phrases (e.g., "5 days", "7 days")
                    for i in range(len(words) - 1):
                        if words[i].isdigit() and words[i + 1] == "days":
                            words[i:i + 2] = [' '.join(words[i:i + 2])]
                            break

                    # Merge frequency phrases (e.g., "Once a day", "Twice a day")
                    for i in range(len(words) - 2):
                        if words[i] in {"Once", "Twice", "Thrice", "Every"} and words[i + 1] == "a" and words[i + 2] == "day":
                            words[i:i + 3] = [' '.join(words[i:i + 3])]
                            break

                    # Skip the first row (header row)
                    if first_row:
                        first_row = False
                        continue

                    # Store extracted data in dictionary
                    if len(words) == 5:  # Ensure valid entries
                        data_dict["medicine"].append(words[0])
                        data_dict["dose"].append(words[1])
                        data_dict["timing"].append(words[2])
                        data_dict["frequency"].append(words[3])
                        data_dict["duration"].append(words[4])
                        print(data_dict)

    return data_dict

@app.route('/upload', methods=['POST'])
def upload_file():
    """Handles the file upload and returns extracted data as JSON."""
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if not file.filename.endswith('.pdf'):
        return jsonify({"error": "Invalid file format. Only PDFs are allowed."}), 400

    # Save the uploaded file temporarily
    pdf_path = "temp_prescription.pdf"
    file.save(pdf_path)

    # Extract prescription data
    extracted_data = extract_prescription_data(pdf_path)
    print(extracted_data)  # Log the extracted text to debug


    return jsonify(extracted_data)

if __name__ == '__main__':
    app.run(debug=True)