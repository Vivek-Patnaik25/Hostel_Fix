import { useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

// For prototype, we assume the socket server is running on localhost:3001 or the render URL
// In production, this would be an env var
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export const useSocket = () => {
    const { data: session } = useSession();
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!session?.user) return;

        // Initialize socket connection
        if (!socketRef.current) {
            socketRef.current = io(SOCKET_URL);

            socketRef.current.on('connect', () => {
                console.log('Connected to socket server');
                // Join room for hostel and user
                if (session.user.hostelNo) {
                    socketRef.current?.emit('join-room', `hostel-${session.user.hostelNo}`);
                }
                socketRef.current?.emit('join-room', `user-${session.user.id}`);
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [session]);

    return socketRef.current;
};
