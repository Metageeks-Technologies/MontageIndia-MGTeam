import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";
const inter = Inter({ subsets: ["latin"] });
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileSidebar from "@/components/ProfileSidebar";

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
    <div className=" h-screen flex gap-8 ">
      <ProfileSidebar />
      {children}
    </div>
  );
}
