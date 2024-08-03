"use client";
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import instance from '@/utils/axios';
import React, { useEffect, useState } from 'react';
const Form1 = dynamic(() => import('@/components/admin/product/product_form1'), { ssr: false });
const Form2 = dynamic(() => import('@/components/admin/product/product_form2'), { ssr: false });
const Form3 = dynamic(() => import('@/components/admin/product/product_form3'), { ssr: false });
const Form4 = dynamic(() => import('@/components/admin/product/product_form4'), { ssr: false });


const ProductCreatePage = () => {
  
    const searchParams = useSearchParams();
    const uuid = searchParams.get('uuid');
    const [formData, setFormData] = useState<any>({});
    const [currentForm, setCurrentForm] = useState(1);
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

export default ProductCreatePage;
