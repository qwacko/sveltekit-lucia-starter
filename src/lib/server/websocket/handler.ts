import type { Server } from 'socket.io';

export const wsHandler = (socketServer: Server) => {
	socketServer.on('connection', (socket) => {
		console.log('Socket Server Received A Connection!', socket);
		socket.emit('message', 'Hello from server !');
		socket.emit('message', 'Hello from server again !');
		socket.on('message', (data) => {
			console.log('Message Received! : ', data);
		});
	});
	socketServer.on('message', (data) => {
		console.log('Message Received : ', data);
	});
};
