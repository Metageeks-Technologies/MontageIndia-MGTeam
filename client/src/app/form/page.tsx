"use client";
import React, { useState } from 'react';
import Form1 from '@/components/product_form1';
import Form2 from '@/components/product_form2';
import Form3 from '@/components/product_form3';

const Page = () => {
  const [formData, setFormData] = useState<any>({});
  const [currentForm, setCurrentForm] = useState(1);

  const handleNext = (data: any) => {
    setFormData((prevData: any) => ({ ...prevData, ...data }));
    setCurrentForm(currentForm + 1);
  };

  const handlePrev = () => {
    setCurrentForm(currentForm - 1);
  };

  return (
    <div className='bg-emerald-200'>
      {currentForm === 1 && <Form1 onNext={handleNext} />}
      {currentForm === 2 && <Form2 onNext={handleNext} onPrev={handlePrev} formData={formData} />}
      {currentForm === 3 && <Form3 formData={formData} onPrev={handlePrev} />}
    </div>
  );
};

export default Page;
