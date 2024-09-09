"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from "../../admin/sidebar";
import instance from '@/utils/axios';
import { Spinner } from '@nextui-org/react';
import {SpinnerLoader} from '@/components/loader/loaders';

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
        return (
            <SpinnerLoader />
        )
    }

    return (
        <div className="flex mt-16 w-full gap-4 px-4 py-6 ">
            {isAuthenticated && !isPasswordResetRoute && <Sidebar />}
            <div className={`${isAuthenticated && !isPasswordResetRoute ? '' : ''} w-full `}>
                {children}
            </div>
        </div>
    )
};

export default AuthWrapper;