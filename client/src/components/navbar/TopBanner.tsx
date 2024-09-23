'use client';
import {useRouter} from "next/navigation";
import {FC, useEffect, useState} from "react";

const TopBanner = () => {
    const [isVisible, setIsVisible] = useState( true );
    const [description, setDescription] = useState( '' );
    const router = useRouter();
   
    
    const handleCloseBanner = () => {
        setIsVisible( false );
    };

    useEffect( () => {
        // Extracting media type from the URL
        const checkMediaTypeFromURL = () => {

            const url = window.location.pathname    

            if ( url.includes( '/audio' ) ) {
                setDescription( 'Great Deal on Audio Files! 20% off for a limited time.' );
                setIsVisible( true );
            } else if ( url.includes( '/video' ) ) {
                setDescription( 'Exclusive Offer on Video Content! Save 25% today.' );
                setIsVisible( true );
            } else if ( url.includes( '/image' ) ) {
                setDescription( 'Special Offer on Image Licensing! Get 15% off.' );
                setIsVisible( true );
            } else {
                setIsVisible( false ); // Hide banner for other types
            }
        };

        checkMediaTypeFromURL(); // Check initially when the component mounts 
    }, [] ); 

    if ( !isVisible ) return null;

    return (
        <div className="bg-black text-white w-full py-2 px-4 flex justify-between items-center gap-5">
            {/* <div className="flex flex-col items-center gap-2"> </div> */}
            <div className="flex items-center w-full sm:justify-center gap-2 ">
                <p className="sm:text-sm text-xs lg:text-base">{description}</p>
                <button className="bg-white hover:bg-red-600 sm:w-40 w-44 text-black font-semibold py-3 sm:px-4 px-4 sm:text-medium text-xs rounded-full transition" onClick={() => router.push("/pricing")}  >
                    Explore Plans
                </button>
            </div>
            <div >
                <button
                    className="text-gray-400 hover:text-gray-200"
                    onClick={handleCloseBanner}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default TopBanner;
