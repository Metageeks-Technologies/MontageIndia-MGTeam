"use clint";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation';
import { FaChevronRight,FaChevronDown } from "react-icons/fa";

const UserDropdown = () => {
    const router = useRouter();
    const [active, setActive] = useState("Loading...");
    const [isOpened, setIsOpened] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        if(pathname.includes("purchased-product")){
            setActive("purchased-product");
        }
        else if(pathname.includes("purchase-history")){
            setActive("purchase-history");
        }
        else if(pathname.includes("subscription")){
            setActive("subscription");
        }
        else if(pathname.includes("wishlist")){
            setActive("wishlist");
        }
        else if(pathname.includes("settings")){
            setActive("settings");
        }
        else{
            setActive("user-profile");
        }
    }, [pathname]);

    const handleToggle = () => {
        setIsOpened(!isOpened);
    };

    const toggleActive = (name: string) => {
        setActive(name);

        if(name==='user-profile'){
            router.push(`/user-profile`);
            return;
        }
        router.push(`/user-profile/${name}`);
    }

    return (
        <>
        <div className={`w-full flex ${!isOpened && "mb-4" } justify-center items-center" `}>
        <button onClick={handleToggle} id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className="sm:hidden w-full justify-between text-zinc-800 border-1 border-gray-600 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center" type="button">{active.split('-').join(' ').toUpperCase()}
       {
              isOpened ? <FaChevronDown className="ml-2"/> : <FaChevronRight className="ml-2"/>
       }
        </button>
        </div>
<div id="dropdown" className={`z-10 ${!isOpened && "hidden"} bg-white divide-y divide-gray-100 border-1 border-gray-600 mb-2 rounded-lg shadow w-full`}>
    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
      <li>
        <button onClick={()=>toggleActive("user-profile")} className={`w-full px-4 py-2  text-start  border-b ${active!="user-profile" ?"text-zinc-800 " : "bg-webred text-white" } `}>User Profile</button>
      </li>
      <li>
        <button onClick={()=>toggleActive("purchased-product")} className={`w-full px-4 py-2  text-start  border-b ${active!="purchased-product" ?"text-zinc-800 " : "bg-webred text-white" } `}>Purchased Product</button>
      </li>
      <li>
       <button onClick={()=>toggleActive("purchase-history")} className={`w-full px-4 py-2  text-start  border-b ${active!="purchase-history" ?"text-zinc-800 " : "bg-webred text-white" } `}>Purchase History</button>
      </li>
      <li>
       <button onClick={()=>toggleActive("subscription")} className={`w-full px-4 py-2  text-start  border-b ${active!="subscription"?"text-zinc-800 " : "bg-webred text-white" } `}>Subscription</button>
      </li>
       <li>
       <button onClick={()=>toggleActive("wishlist")} className={`w-full px-4 py-2  text-start  border-b ${active!="wishlist" ?"text-zinc-800 " :"bg-webred text-white" } `}>Wishlist</button>
      </li>
       <li>
       <button onClick={()=>toggleActive("settings")} className={`w-full px-4 py-2 text-start  ${active!="settings"?"text-zinc-800 " : "bg-webred text-white" } `}>Settings</button>
      </li>
    </ul>
</div>
</>
    )
}

export default UserDropdown;