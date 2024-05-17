import { browser } from '$app/environment';
import { boolean } from 'drizzle-orm/pg-core';
import { connect, io } from 'socket.io-client';
import { untrack } from 'svelte';

let socketClient: ReturnType<typeof connectSocket> | undefined = undefined;

const connectSocket = () => io({ path: '/wss/' });

export const getSocket = (onData: (data: any) => void) => {
	let state = $state<{
		connected: boolean;
		userConnected: boolean;
		roomConnected: boolean;
		socketError: string | null;
		currentRoom: string | null;
	}>({
		connected: false,
		userConnected: false,
		roomConnected: false,
		socketError: null,
		currentRoom: null
	});

	let roomName = $state<{ name?: string | undefined }>({});

	let socket: ReturnType<typeof connectSocket> | undefined = undefined;

	if (browser) {
		console.log('Connecting To Websocket From Client');

		socket = connectSocket();

		socket.on('connect', () => {
			state.connected = true;
		});
		socket.on('userConnected', (data) => {
			state.userConnected = true;
		});

		socket.on('error', (error) => {
			state.socketError = error;
		});

		$effect(() => {
			roomName.name;
			state.connected;
			state.userConnected;

			untrack(() => {
				if (state.currentRoom !== roomName.name && state.roomConnected) {
					state.roomConnected = false;
				}

				if (
					socket &&
					state.connected &&
					state.userConnected &&
					roomName.name &&
					!state.roomConnected
				) {
					socket.emit('join', { room: roomName.name });
				}
			});
		});

		socket.on('joined', (data) => {
			state.roomConnected = true;
			state.socketError = null;
		});

		socket.on('disconnect', () => {
			console.log('Websocket Disconnected');
		});

		socket.on('mouse', onData);
	}

	// socketClient = socket;

	return { socket, socketState: state, roomName };
};
