import 'dotenv/config';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env['NEXT_PUBLIC_SOCKET_URL'];

if (!SOCKET_URL) {
  console.error('No SOCKET_URL environment variable set');
}

export const socket: Socket = io(SOCKET_URL, {
  transports: ['websocket'],
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});

socket.on('connect', () => {
  console.log('Centralized Socket Connected:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('Centralized Socket Disconnected:', reason);
});
