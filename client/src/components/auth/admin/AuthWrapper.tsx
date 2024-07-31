"use client";

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

    const checkAuth = () =>
    {
        instance.get( '/auth/admin/getCurrAdmin' )
            .then( response =>
            {
                const user = response.data;
                console.log('user')
                if ( user )
                {
                    setIsAuthenticated( true );
                } else
                {
                    console.log("error in getting in user")
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
                console.log('tjos is ifnla')
                setIsLoading( false );
            } );
    };

    console.log("useefect caleed")  
    useEffect( () =>
    {
        if ( !isAuthenticated && isLoading )
        {
            checkAuth();
        }
    }, [ isAuthenticated, isLoading, router ] );


    // if current endpoint is admin/login than set isathentuated(false)

    const checkEndpoint = () =>
    {
        if ( typeof window !== "undefined" && window.location.href === '/auth/admin/login' )
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
        <div className="flex items-center">

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