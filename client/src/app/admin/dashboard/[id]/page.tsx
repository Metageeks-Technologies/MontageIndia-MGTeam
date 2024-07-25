// pages/admin/users/[id].tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Input, Button, Card, Text } from "@nextui-org/react";  

interface User
{
    id: string;
    name: string;
    email: string;
    role: string;
    // Add other user properties as needed
}

export default function UserDetails ()
{
    const [ user, setUser ] = useState<User | null>( null );
    const [ isEditing, setIsEditing ] = useState( false );
    const router = useRouter();
    const { id } = router.query;

    useEffect( () =>
    {
        if ( id )
        {
            fetchUser();
        }
    }, [ id ] );

    const fetchUser = async () =>
    {
        try
        {
            const response = await fetch( `/api/users/${ id }` );
            const data = await response.json();
            setUser( data );
        } catch ( error )
        {
            console.error( 'Error fetching user:', error );
        }
    };

    const handleInputChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
    {
        if ( user )
        {
            setUser( { ...user, [ e.target.name ]: e.target.value } );
        }
    };

    const handleUpdate = async () =>
    {
        try
        {
            const response = await fetch( `/api/users/${ id }`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( user ),
            } );
            if ( response.ok )
            {
                setIsEditing( false );
                // Optionally, show a success message
            }
        } catch ( error )
        {
            console.error( 'Error updating user:', error );
        }
    };

    const handleDelete = async () =>
    {
        if ( confirm( 'Are you sure you want to delete this user?' ) )
        {
            try
            {
                const response = await fetch( `/api/users/${ id }`, {
                    method: 'DELETE',
                } );
                if ( response.ok )
                {
                    router.push( '/admin/users' );
                }
            } catch ( error )
            {
                console.error( 'Error deleting user:', error );
            }
        }
    };

    if ( !user ) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-4">
            <Card className="p-6">
                <Text h1 size={ 24 } className="mb-4">User Details</Text>
                <div className="space-y-4">
                    <Input
                        label="Name"
                        name="name"
                        value={ user.name }
                        onChange={ handleInputChange }
                        disabled={ !isEditing }
                    />
                    <Input
                        label="Email"
                        name="email"
                        value={ user.email }
                        onChange={ handleInputChange }
                        disabled={ !isEditing }
                    />
                    <Input
                        label="Role"
                        name="role"
                        value={ user.role }
                        onChange={ handleInputChange }
                        disabled={ !isEditing }
                    />
                    {/* Add other user fields as needed */ }
                </div>
                <div className="mt-6 space-x-2">
                    { isEditing ? (
                        <>
                            <Button color="primary" onClick={ handleUpdate }>Save</Button>
                            <Button color="secondary" onClick={ () => setIsEditing( false ) }>Cancel</Button>
                        </>
                    ) : (
                        <Button color="primary" onClick={ () => setIsEditing( true ) }>Edit</Button>
                    ) }
                    <Button color="danger" onClick={ handleDelete }>Delete</Button>
                </div>
            </Card>
        </div>
    );
}