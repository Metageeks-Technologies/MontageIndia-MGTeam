import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";
const inter = Inter({ subsets: ["latin"] });
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileSidebar from "@/components/ProfileSidebar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Profile",
  description: "Profile Page",
};

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <div className="flex  gap-4">
      <div className="w-80  p-4 py-12 border-r"><ProfileSidebar /></div>
      
      <div className=" w-full px-5 py-8">{children}</div>
      
    </div>
    <Footer/>
    </>
  );
}
