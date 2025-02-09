
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import google.generativeai as palm
# import pdfplumber
# import re  # Added import for regular expressions

# app = Flask(__name__)
# CORS(app)

# key = "AIzaSyDxByW2GpWT0OKSLifZbiFatBZyG_8QfDE"
# if not key:
#     raise ValueError("GOOGLE_API_KEY environment variable not set.")

# palm.configure(api_key=key)
# model = palm.GenerativeModel("gemini-1.5-flash")

# @app.route('/summarize', methods=['POST'])
# def summarize():
#     if 'file' not in request.files:
#         return jsonify({"error": "No file uploaded"}), 400

#     uploaded_file = request.files['file']
#     data_dict = {"medicine": [], "dose": [], "timing": [], "frequency": [], "duration": []}
#     start_extracting = False

#     with pdfplumber.open(uploaded_file) as pdf:
#         for page in pdf.pages:
#             text = page.extract_text()
#             if not text:
#                 continue
#             lines = text.split("\n")

#             for line in lines:
#                 if "Medicines Prescribed" in line:
#                     start_extracting = True
#                     continue  # Skip the current line containing section header

#                 if "Advice:" in line:
#                     start_extracting = False
#                     break

#                 if start_extracting:
#                     # Split columns using 2+ spaces and strip whitespace
#                     columns = re.split(r'\s{2,}', line.strip())
                    
#                     # Skip header and separator lines
#                     if columns and columns[0] == "Medicine":
#                         continue
#                     if any('---' in col for col in columns):
#                         continue
                    
#                     # Validate and store data
#                     if len(columns) == 5:
#                         data_dict["medicine"].append(columns[0])
#                         data_dict["dose"].append(columns[1])
#                         data_dict["timing"].append(columns[2])
#                         data_dict["frequency"].append(columns[3])
#                         data_dict["duration"].append(columns[4])

#     if uploaded_file.filename == '':
#         return jsonify({"error": "No file selected"}), 400

#     try:
#         # Rest of the code remains unchanged
#         file_content = uploaded_file.read().decode('utf-8', errors='ignore')
#         prompt = f"""
#         Please provide a concise and informative summary of the following dictionary, focusing on the key points and main arguments.  Aim for a summary that is about 200-250 words long and captures the essence of the original document.  Maintain the original tone and avoid adding any personal opinions or interpretations.  If the text is code, summarize the functionality and purpose of the code.
# \n
#         {data_dict}
#         ```
#         """
        
#         response = model.generate_content(prompt)
#         summary = response.text
        
#         if not summary:
#             return jsonify({"error": "No summary generated"}), 500

#         return jsonify({"summary": summary})

#     except Exception as e:
#         print(f" Error: {str(e)}")
#         return jsonify({"error": str(e)}), 500



from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as palm
import pdfplumber
import re  # Regular expressions for splitting columns

app = Flask(__name__)
CORS(app)

key = "AIzaSyDxByW2GpWT0OKSLifZbiFatBZyG_8QfDE"
if not key:
    raise ValueError("GOOGLE_API_KEY environment variable not set.")

palm.configure(api_key=key)
model = palm.GenerativeModel("gemini-1.5-flash")

@app.route('/summarize', methods=['POST'])
def summarize():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    uploaded_file = request.files['file']
    extracted_text = ""

    with pdfplumber.open(uploaded_file) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                extracted_text += text + "\n"

    if not extracted_text:
        return jsonify({"error": "No text extracted from the PDF"}), 400
    print(extracted_text)

    try:
        # Create a prompt to generate a summary
        prompt = f"""
        Please provide a concise and informative summary of the following text, focusing on the key points such as the name of the medicine, its dosage, timing, frequency, and duration. Aim for a summary that is about 200-250 words long, capturing the essential details. Maintain the original tone and avoid adding any personal opinions or interpretations.

        The details are as follows:

        ```
        {extracted_text}
        ```

        Summarize the medication details including their use, dosage instructions, and duration in a clear and simple manner.
        """

        # Send the prompt to the AI model for summary generation
        response = model.generate_content(prompt)
        summary = response.text

        if not summary:
            return jsonify({"error": "No summary generated"}), 500

        return jsonify({"summary": summary})

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
