"use client";
import React, { useState } from 'react';
import Form1 from '@/components/product_form1';
import Form2 from '@/components/product_form2';
import Form3 from '@/components/product_form3';

const Page = () => {
  const [formData, setFormData] = useState<any>(null);
  const [disablePrev, setDisablePrev] = useState(false);
  const [currentForm, setCurrentForm] = useState(1);

  const handleNext = (data: any) => {
    setFormData(data);
    setCurrentForm(2);
  };

  const handleDisablePrev = () => {
    setDisablePrev(true);
  };

  return (
    <div>
      {/* {currentPage === 1 && <Form1 onNext={nextPage} />}
      {currentPage === 2 && <Form2 onPrev={prevPage} onNext={nextPage} />}
      {currentPage === 3 && <Form3 onPrev={prevPage}   />} */}
     {currentForm === 1 && <Form1 onNext={handleNext} />}
      {currentForm === 2 && <Form2 onPrev={() => setCurrentForm(1)} onNext={() => console.log('Next form')} disablePrev={disablePrev} handleDisablePrev={handleDisablePrev} formData={formData} />}
  
    </div>
  );
};

export default Page;
