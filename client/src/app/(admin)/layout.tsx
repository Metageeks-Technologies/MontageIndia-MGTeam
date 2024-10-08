import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import "../globals.css";
const inter = Inter( { subsets: [ "latin" ] } );
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthWrapper from "../../components/auth/admin/AuthWrapper";
import Navbar from "@/components/admin/Navbar";

export const metadata: Metadata = {
  title: "Montage India",
  description: "Generated by create next app",
};

export default function AdminLayout ( {
  children,
}: Readonly<{
  children: React.ReactNode;
}> )
{
  return (
      <div className={ inter.className }>
        <ToastContainer />
        <Navbar/>
        <AuthWrapper>
          { children }
        </AuthWrapper>
      </div>
  );
}