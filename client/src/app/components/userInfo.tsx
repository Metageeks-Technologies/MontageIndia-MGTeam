// components/UserList.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import axios from 'axios';

interface User
{
    id: string;
    name: string;
    email: string;
    role: string;
}

export default function UserList ()
{
    const [ users, setUsers ] = useState<User[]>( [] );
    const router = useRouter();

    useEffect( () =>
    {
        // Fetch users from your API
        const fetchUsers = async () =>
        {
            try
            {
                const response = await axios( `${ process.env.NEXT_PUBLIC_SERVER_URL }/api/v1/auth/admin/getAllAdmin` );
                console.log("all users:-",response)
                const data = response.data;
                setUsers( data );
            } catch ( error )
            {
                console.error( 'Error fetching users:', error );
            }
        };

        fetchUsers();
    }, [] );

    const handleRowClick = ( userId: string ) =>
    {
        router.push( `/admin/users/${ userId }` );
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">User List</h1>
            <Table aria-label="User list table">
                <TableHeader>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>EMAIL</TableColumn>
                    <TableColumn>ROLE</TableColumn>
                </TableHeader>
                <TableBody>
                    { users.map( ( user ) => (
                        <TableRow key={ user.id } onClick={ () => handleRowClick( user.id ) } className="cursor-pointer hover:bg-gray-100">
                            <TableCell>{ user.name }</TableCell>
                            <TableCell>{ user.email }</TableCell>
                            <TableCell>{ user.role }</TableCell>
                        </TableRow>
                    ) ) }
                </TableBody>
            </Table>
        </div>
    );
}