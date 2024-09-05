"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from "../../admin/sidebar";
import instance from '@/utils/axios';
import { Spinner } from '@nextui-org/react';

const AuthWrapper = ( { children }: { children: React.ReactNode; } ) =>
{
    const router = useRouter();
    const pathname = usePathname();
    const [ isAuthenticated, setIsAuthenticated ] = useState( false );
    const [ isLoading, setIsLoading ] = useState( true );

    const isPasswordResetRoute = pathname.startsWith( '/admin/reset-password' );

    const checkAuth = () =>
    {
        if ( isPasswordResetRoute )
        {
            setIsAuthenticated( false );
            setIsLoading( false );
            return;
        }

        instance.get( '/auth/admin/getCurrAdmin' )
            .then( response =>
            {
                const user = response.data;
                if ( user )
                {
                    setIsAuthenticated( true );
                } else
                {
                    setIsAuthenticated( false );
                    router.push( '/auth/admin/login' );
                }
            } )
            .catch( error =>
            {
                console.error( 'Error checking authentication', error );
                setIsAuthenticated( false );
                router.push( '/auth/admin/login' );
            } )
            .finally( () =>
            {
                setIsLoading( false );
            } );
    };

    useEffect( () =>
    {
        if ( !isAuthenticated && isLoading )
        {
            checkAuth();
        }
    }, [ isAuthenticated ] );

    if ( isLoading )
    {
        return <div className="flex justify-center items-center h-screen">
            <Spinner label="Loading..." color="danger" />
        </div>;
    }

    return (
        <div className="flex items-center w-[95%] mx-auto">
            {isAuthenticated && !isPasswordResetRoute && <Sidebar />}
            <div className={`${isAuthenticated && !isPasswordResetRoute ? 'ml-48' : ''} w-full  mt-16 `}>
                {children}
            </div>
        </div>
    )
};

export default AuthWrapper;