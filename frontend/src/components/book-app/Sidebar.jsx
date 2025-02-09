import React, { useState } from 'react';

const Sidebar = () => {
  const steps = ['Location', 'Date & Time', 'Payment', 'Confirmation'];
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className='min-h-screen bg-white border-r'>
      <ul className='text-[#515151] mt-5'>
        {steps.map((step, index) => (
          <li
            key={index}
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer 
              ${index === activeStep ? 'bg-[#F2F3FF] border-r-4 border-primary' : 'hover:bg-gray-100'}`}
            onClick={() => setActiveStep(index)}
          >
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
