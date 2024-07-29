import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter( { subsets: [ "latin" ] } );
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "./admin/componets/sidebar";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};//h

export default function RootLayout ( {
  children,
}: Readonly<{
  children: React.ReactNode;
}> )
{
  return (
    <html lang="en">
      <body className={ inter.className }>
        <ToastContainer />

        <div className="flex justify-center items-center gap-6">
          <div className="w-1/6">
          <Sidebar/>
          </div>
         
          
       
        <div className=" w-5/6 ">
        { children }
        </div>

        </div>
       
      </body>
    </html>
  );
}
