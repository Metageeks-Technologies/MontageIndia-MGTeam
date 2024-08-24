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
      <div className="flex md:gap-4">
        <ProfileSidebar />
        <div className="w-full px-2 py-4 md:px-4 md:py-8 ">{children}</div>
      </div>
      <Footer />
    </>
  );
}
