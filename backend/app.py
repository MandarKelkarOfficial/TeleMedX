# from flask import Flask, request, jsonify
# import pdfplumber
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)


# def extract_prescription_data(pdf_path):
#     """Extracts medicine details from the given PDF file."""
#     data_dict = {"medicine": [], "dose": [], "timing": [], "frequency": [], "duration": []}
#     start_extracting = False
#     first_row = True  # Flag to skip the first row (headers)

#     with pdfplumber.open(pdf_path) as pdf:
#         for page in pdf.pages:
#             text = page.extract_text()
#             if not text:
#                 continue
#             lines = text.split("\n")

#             for line in lines:
#                 if "Medicines Prescribed" in line:
#                     start_extracting = True
#                     continue

#                 if "Advice:" in line:
#                     start_extracting = False
#                     break

#                 if start_extracting:
#                     words = line.split()

#                     # Merge "After meals" into a single token
#                     for i in range(len(words) - 1):
#                         if words[i] == "After" and words[i + 1] == "meals":
#                             words[i:i + 2] = ["After meals"]
#                             break

#                     # Merge duration phrases (e.g., "5 days", "7 days")
#                     for i in range(len(words) - 1):
#                         if words[i].isdigit() and words[i + 1] == "days":
#                             words[i:i + 2] = [' '.join(words[i:i + 2])]
#                             break

#                     # Merge frequency phrases (e.g., "Once a day", "Twice a day")
#                     for i in range(len(words) - 2):
#                         if words[i] in {"Once", "Twice", "Thrice", "Every"} and words[i + 1] == "a" and words[i + 2] == "day":
#                             words[i:i + 3] = [' '.join(words[i:i + 3])]
#                             break

#                     # Skip the first row (header row)
#                     if first_row:
#                         first_row = False
#                         continue

#                     # Store extracted data in dictionary
#                     if len(words) == 5:  # Ensure valid entries
#                         data_dict["medicine"].append(words[0])
#                         data_dict["dose"].append(words[1])
#                         data_dict["timing"].append(words[2])
#                         data_dict["frequency"].append(words[3])
#                         data_dict["duration"].append(words[4])
#                         print(data_dict)

#     return data_dict

# @app.route('/upload', methods=['POST'])
# def upload_file():
#     """Handles the file upload and returns extracted data as JSON."""
#     if 'file' not in request.files:
#         return jsonify({"error": "No file part"}), 400

#     file = request.files['file']

#     if file.filename == '':
#         return jsonify({"error": "No selected file"}), 400

#     if not file.filename.endswith('.pdf'):
#         return jsonify({"error": "Invalid file format. Only PDFs are allowed."}), 400

#     # Save the uploaded file temporarily
#     pdf_path = "temp_prescription.pdf"
#     file.save(pdf_path)

#     # Extract prescription data
#     extracted_data = extract_prescription_data(pdf_path)
#     print(extracted_data)  # Log the extracted text to debug


#     return jsonify(extracted_data)

# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as palm  # Import the Gemini library
import pdfplumber


app = Flask(__name__)
CORS(app)

# Load API Key securely from environment variable
key = "AIzaSyDxByW2GpWT0OKSLifZbiFatBZyG_8QfDE"  # Replace this with your actual API key
if not key:
    raise ValueError("GOOGLE_API_KEY environment variable not set.")

# Configure the API
palm.configure(api_key=key)
model = palm.GenerativeModel("gemini-1.5-flash")



# def extract_prescription_data(pdf_path):

@app.route('/summarize', methods=['POST'])
def summarize():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    uploaded_file = request.files['file']
    
    """Extracts medicine details from the given PDF file."""
    data_dict = {"medicine": [], "dose": [], "timing": [], "frequency": [], "duration": []}
    start_extracting = False
    first_row = True  # Flag to skip the first row (headers)

    with pdfplumber.open(uploaded_file) as pdf:
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

    if uploaded_file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    try:
        file_content = uploaded_file.read().decode('utf-8', errors='ignore')
        print(file_content)
        print(" File content read successfully")
        prompt = f"""
        Please provide a concise and informative summary of the following text, focusing on the key points and main arguments.  Aim for a summary that is about 200-250 words long and captures the essence of the original document.  Maintain the original tone and avoid adding any personal opinions or interpretations.  If the text is code, summarize the functionality and purpose of the code.

        ```
        {data_dict}
        ```
        """
        
        # Initialize and generate summary
        response = model.generate_content(prompt)
        
        # Get the summary directly from the response
        summary = response.text  # Fixed: no parentheses
        print(" Summary genrated successfully")
        
        # Check if the summary is empty or None
        if not summary:
            return jsonify({"error": "No summary generated"}), 500

        return jsonify({"summary": summary})

    except Exception as e:
        print(f" Error: {str(e)}")
        return jsonify({"error": str(e)}), 500