"use client";
import { useSearchParams } from 'next/navigation';
import instance from '@/utils/axios';
import React, { useEffect, useState } from 'react';
import Form1 from '@/components/admin/product/product_form1';
import Form2 from '@/components/admin/product/product_form2';
import Form3 from '@/components/admin/product/product_form3';
import Form4 from '@/components/admin/product/product_form4';
import useAdminAuth from '@/components/hooks/useAdminAuth';


  const Page = () => {
    const {user}=useAdminAuth();
    console.log(user)
    const searchParams = useSearchParams();
    const uuid = searchParams.get('uuid');
    const [formData, setFormData] = useState<any>({});
    const [currentForm, setCurrentForm] = useState(1);
    console.log(uuid)
  useEffect(() => {
    if (uuid) {
      instance(`/product/${uuid}`)
        .then((response:any) => {
          const data = response.data;
          setFormData(data);
          console.log("first",data.product)
          if (data) {
            if (data.product.thumbnailKey) {
              setCurrentForm(4);
            } else {
              setCurrentForm(2);
              console.log("first",data)
            }
          } else {
            setCurrentForm(1);
          }
        })
        .catch(() => {
          setCurrentForm(1);
        });
    }
  }, [uuid]);
  
  const handleNext = (data: any) => {
    setFormData((prevData: any) => ({ ...prevData, ...data }));
    setCurrentForm(currentForm + 1);
  };

  const handlePrev = () => {
    setCurrentForm(currentForm - 1);
  };

  return (
    <div className="container mx-auto p-4">
      <div>
        <div className='flex w-full justify-start text-3xl font-semibold text-black p-3 border-b-[1px] border-gray-400'>
          Add product
        </div>
        <div className='p-6'>
        {currentForm === 1 && <Form1 onNext={handleNext} />}
        {currentForm === 2 && <Form2 onNext={handleNext} onPrev={handlePrev} formData={formData} />}
        {currentForm === 3 && <Form3 onNext={handleNext} formData={formData}   />}
        {currentForm === 4 && <Form4  formData={formData}   />}
        </div>  

      </div>
    </div>

  );
};

export default Page;
