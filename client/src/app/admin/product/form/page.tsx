"use client";
import React, { useState } from 'react';
import Form1 from '@/components/product_form1';
import Form2 from '@/components/product_form2';
import Form3 from '@/components/product_form3';
import Sidebar from '../../componets/sidebar';

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
    <div className=''>
      <Sidebar/>
      <div>
        <div className='flex w-full justify-start text-3xl font-semibold text-black p-3 border-b-[1px] border-gray-400'>
          Add product
        </div>
        <div className='p-3'>
        {currentForm === 1 && <Form1 onNext={handleNext} />}
        {currentForm === 2 && <Form2 onNext={handleNext} onPrev={handlePrev} formData={formData} />}
        {currentForm === 3 && <Form3 formData={formData} onPrev={handlePrev} />}
        </div>

      </div>
    </div>

  );
};

export default Page;
