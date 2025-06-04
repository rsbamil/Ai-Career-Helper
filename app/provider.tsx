"use client";
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import React, { useEffect, useRef } from 'react';

function Provider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user, isLoaded } = useUser();
    const hasCreatedUser = useRef(false); // prevent duplicate calls

    useEffect(() => {
        const createNewUser = async () => {
            try {
                await axios.post('/api/testuser');
                hasCreatedUser.current = true;
            } catch (error) {
                console.error('Failed to create user:', error);
            }
        };

        if (isLoaded && user && !hasCreatedUser.current) {
            createNewUser();
        }
    }, [isLoaded, user]);

    return <div>{children}</div>;
}

export default Provider;
