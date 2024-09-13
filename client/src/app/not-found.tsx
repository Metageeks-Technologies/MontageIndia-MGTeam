"use client"
import Footer from '@/components/Footer';
import { useRouter,usePathname } from 'next/navigation';
import React,{useState,useEffect} from 'react';

const Page = () => {
    const router = useRouter();
    const pathName= usePathname();
    const [isAdmin, setIsAdmin] = useState(false);

    const handleBack = () => {
      if(isAdmin){
        return router.push('/admin/dashboard');
      }
      return router.push('/');
    }

    useEffect(() => {
      if(pathName.includes('/admin')){
        setIsAdmin(true);
      }
    }, [pathName]);

  return (
    <div>
    <div className="h-screen border flex justify-center items-center px-4">
      <div className="flex flex-col space-y-2 items-center text-center max-w-lg">
        <img src="/asset/Not Found.png" alt="Not Found" className="w-full max-w-xs md:max-w-sm" />
        <h1 className="text-3xl md:text-4xl font-semibold">Oops! Page Not Found</h1>
        <p className="text-sm md:text-base">
          Sorry, we couldn't find the page you are looking for.
        </p>
        <div className='py-3'>
        <button className="bg-[#FE423F] py-2 px-6 md:py-2.5 md:px-8 text-white rounded-md shadow-md"
          onClick={handleBack}
        >
          Go Back Home Page
        </button>
        </div>
      </div>
    </div>
    {/* <Footer/> */}
    </div>
  );
};

export default Page;
