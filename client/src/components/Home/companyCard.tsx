import Image from 'next/image';
import React from 'react';

type Company = {
  name: string;
  logo: string;
};

const companies: Company[] = [
  { name: 'epaimages', 
    logo: 'https://www.freepnglogos.com/uploads/company-logo-png/hyundai-motor-company-logo-png-transparent-0.png'
 },
  { name: 'LIFE', 
    logo: 'https://www.freepnglogos.com/uploads/company-logo-png/file-mobile-apps-development-company-logo-25.png' 
},
  { name: 'BFA', 
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png'
 },
  { name: 'REX', 
    logo: 'https://images.squarespace-cdn.com/content/v1/65cc1cf13342f55636857090/0f138d93-260d-411e-a7b4-a52fb2d27d78/Dark+Logo.png' 
},
  { name: 'STRINGR', 
    logo: 'https://images.squarespace-cdn.com/content/v1/5f0097caead12b7ccccaac20/dd58c926-7bba-40ef-9f8b-0c8db6f004b0/Add_The_Wonder_Black.png' 
},
  { name: 'itv', 
    logo: 'https://static.vecteezy.com/system/resources/previews/020/975/568/original/tvs-logo-tvs-icon-transparent-free-png.png'
 },
];

const CompaniesCard: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <h2 className="text-xl font-bold mb-5">Trusted by the world's largest companies</h2>
      <div className="flex space-x-8 mb-5">
        {companies.map((company) => (
          <div key={company.name} className="flex items-center">
            <img src={company.logo} alt={company.name} 
            className='h-20 w-40 object-cover' 
            />
          </div>
        ))}
      </div>
      <p className="mb-5">Need a personalized package for your business?</p>
      <button className="bg-red-500 text-white py-2 px-4 rounded-3xl">Request a Quote</button>
    </div>
  );
};

export default CompaniesCard;
