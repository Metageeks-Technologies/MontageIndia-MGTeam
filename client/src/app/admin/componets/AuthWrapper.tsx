'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Sidebar from "./sidebar";

const AuthWrapper = ( { children }: { children: React.ReactNode; } ) =>
{
    const router = useRouter();
    const [ isAuthenticated, setIsAuthenticated ] = useState( false );
    const [ isLoading, setIsLoading ] = useState( true );

    useEffect( () =>
    {
        const checkAuth = () =>
        {
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
        }
    };
    checkEndpoint();

    if ( isLoading )
    {
        return <div>Loading...</div>;
    }


    return (
        <div className="flex justify-center items-center gap-6">
            { isAuthenticated &&
                <div className="w-1/6">
                    <Sidebar />
                </div> }
            <div className="w-5/6">
                { children }
            </div>
        </div>
    );
};

export default AuthWrapper;