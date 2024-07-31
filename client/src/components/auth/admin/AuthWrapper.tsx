'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Sidebar from "../../admin/sidebar";
import instance from '@/utils/axios';

const AuthWrapper = ( { children }: { children: React.ReactNode; } ) =>
{
    const router = useRouter();
    const [ isAuthenticated, setIsAuthenticated ] = useState( false );
    const [ isLoading, setIsLoading ] = useState( true );

    useEffect( () =>
    {
        const checkAuth = async() =>
        {
            // const user = await instance('/auth/admin/')
            // Check token in cookies
            const cookieToken = Cookies.get( 'token' );
            console.log( 'Token from cookies:', cookieToken );

            // Check token in localStorage
            const localToken = localStorage.getItem( 'token' );
            console.log( 'Token from localStorage:', localToken );

            if ( localToken )
            {
                setIsAuthenticated( true );
            } else
            {
                setIsAuthenticated( false );
                router.push( '/admin/login' );
            }
            setIsLoading( false );
        };

        checkAuth();
    }, [ router ] );

    // if current endpoint is admin/login than set isathentuated(false)

    const checkEndpoint = () =>
    {
        if ( typeof window !== "undefined" && window.location.href === '/admin/login' )
        {
            setIsAuthenticated( false );
            router.refresh();
        }
    };
    checkEndpoint();

    if ( isLoading )
    {
        return <div>Loading...</div>;
    }


    return (
        <div  className="flex items-center">
           
            { isAuthenticated &&
                
                    <Sidebar />
                 }
            <div className="md:ml-[20%] sm:ml-[25%] w-full">
                { children }
            </div>
             
        </div>
    );
};

export default AuthWrapper;