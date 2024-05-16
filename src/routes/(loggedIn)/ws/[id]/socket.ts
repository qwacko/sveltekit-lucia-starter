import { connect, io } from 'socket.io-client';

let socketClient: ReturnType<typeof connectSocket> | undefined = undefined;

const connectSocket = () => io({ path: '/wss/' });

export const getSocket = (roomName: string) => {
	if (socketClient) {
		return socketClient;
	}

	console.log('Connecting To Websocket From Client');

	const socket = connectSocket();

	socket.on('connect', () => {
		socket.emit('join', { room: roomName });
	});

	socketClient = socket;

	return socket;
};
