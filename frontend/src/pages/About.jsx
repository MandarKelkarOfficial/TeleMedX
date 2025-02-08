import React from 'react';

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-6 sm:p-10">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">About TeleMedX</h1>
        <p className="text-gray-600 mt-4">
          Learn more about TeleMedX – our journey, mission, and values.
        </p>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto">
        {/* Vision and Mission */}
        <div className="flex flex-col sm:flex-row gap-6 items-center mb-12">
          <img
            className="w-full sm:w-1/2 rounded-lg shadow-lg"
            src="https://picsum.photos/500/300?random=1"
            alt="Vision and Mission"
          />
          <div className="sm:w-1/2">
            <h2 className="text-2xl font-semibold text-gray-800">Our Vision</h2>
            <p className="text-gray-600 mt-3">
              At TeleMedX, we aim to revolutionize the way healthcare is delivered by providing seamless and efficient solutions to both patients and doctors.
            </p>
            <h2 className="text-2xl font-semibold text-gray-800 mt-6">
              Our Mission
            </h2>
            <p className="text-gray-600 mt-3">
              Empower people to live healthier lives by connecting them with the best healthcare services, ensuring accessibility, affordability, and quality care through TeleMedX.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Meet the TeleMedX Team</h2>
          <p className="text-gray-600 mt-4">
            A group of dedicated professionals working together to bring you the best healthcare experience.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Individual Team Member */}
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg text-center"
              >
                <img
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                  src={`https://picsum.photos/150/150?random=${index + 1}`}
                  alt={`Team Member ${index + 1}`}
                />
                <h3 className="text-lg font-medium text-gray-800">
                  TeleMedX Team Member {index + 1}
                </h3>
                <p className="text-sm text-gray-500">Role/Position</p>
              </div>
            ))}
        </div>

        {/* Values Section */}
        <div className="flex flex-col sm:flex-row gap-6 items-center mt-12">
          <div className="sm:w-1/2">
            <h2 className="text-2xl font-semibold text-gray-800">
              Our Core Values at TeleMedX
            </h2>
            <ul className="list-disc list-inside mt-4 text-gray-600">
              <li>Commitment to Quality</li>
              <li>Integrity and Transparency</li>
              <li>Innovation and Growth</li>
              <li>Empathy and Care</li>
            </ul>
          </div>
          <img
            className="w-full sm:w-1/2 rounded-lg shadow-lg"
            src="https://picsum.photos/500/300?random=4"
            alt="Core Values"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
