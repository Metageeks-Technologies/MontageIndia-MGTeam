"use client";
import React, { useState } from 'react';
import Form1 from '@/components/product_form1';
import Form2 from '@/components/product_form2';
import Form3 from '@/components/product_form3';

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div>
      {currentPage === 1 && <Form1 onNext={nextPage} />}
      {currentPage === 2 && <Form2 onPrev={prevPage} onNext={nextPage} />}
      {currentPage === 3 && <Form3 onPrev={prevPage}   />}
    </div>
  );
};

export default Page;
