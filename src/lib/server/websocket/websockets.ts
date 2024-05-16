import { Server } from 'socket.io';
import { wsHandler } from './handler';

let socketServer: undefined | ReturnType<typeof setSocketServer> = undefined;
let isSocketServerInitialised = false;

const setSocketServer = () => {
	return new Server({
		/* options */
	});
};

export const initialiseSocketServer = () => {
	console.log('Initialising Socket Server');
	if (isSocketServerInitialised) return;
	if (socketServer) return;
	socketServer = setSocketServer();

	if (socketServer) {
		wsHandler(socketServer);
		socketServer.path('/wscustom/');

		socketServer.listen(3005);
		isSocketServerInitialised = true;
		return socketServer;
	}
};
