'use client';
import instance from "@/utils/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";

const Navbar = () =>
{
    const [ currentUser, setCurrentUser ] = useState<any>( "" );
    const router = useRouter();
    useEffect( () =>
    {
        // Fetching user details
        instance
            .get( "/auth/admin/getCurrAdmin" )
            .then( ( response: any ) =>
            {
                // console.log( 'User details:', response.data );
                setCurrentUser( response.data.user );
            } )
            .catch( ( error ) =>
            {
                console.error( "Error fetching user details:", error );
            } );
    }, [] );

    return (
        <nav className="bg-pureWhite-light p-4 fixed top-0 w-full z-50 flex justify-between     " >
            <div>
                <img src='/images/logo.png' alt="logo" className="h-8 mr-3" />
            </div>
            <div className="container mx-auto flex justify-end items-center cursor-pointer"
                onClick={ () => router.push( "/admin/profile" ) }
            >
                { currentUser?.name }
                <FaRegUserCircle className="w-8 h-8 ml-3 " /> 
            </div>
        </nav>
    );
};

export default Navbar;