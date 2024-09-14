import Footer from "@/components/Footer";
import ProfileSidebar from "@/components/ProfileSidebar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import "../../globals.css";
const inter = Inter({ subsets: ["latin"] });

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
      <div className="flex gap-1 lg:gap-2">
        <ProfileSidebar />
        <div className="w-full sm:px-2 sm:py-4 lg:px-4 lg:py-6" >
        {children}
        </div>
      </div>
      <Footer />
    </>
  );
}
