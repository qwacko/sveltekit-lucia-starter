import { authGuard } from '$lib/authGuard/authGuardConfig';
import { initateCronJobs } from '$lib/server/cron/cron';
import { dbNoAdmins } from '$lib/server/db/actions/firstUser';

import { auth } from '$lib/server/lucia';
// import { initialiseSocketServer } from '$lib/server/websocket/websockets';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { useServer } from 'vite-sveltekit-node-ws';
import { Server } from 'socket.io';
import type { User } from 'lucia';

const allowedRooms = ['room1', 'room2', 'room3'];

export const wsServer = () =>
	useServer(
		(server) => {
			console.log('Initialising Websocker Server!');
			const wsServer = new Server(server, { path: '/wss/' });
			wsServer.on('connect', async (ws) => {
				const rooms: string[] = [];

				let user: User | undefined | null = undefined;

				if (ws.handshake.headers.cookie) {
					await Promise.all(
						ws.handshake.headers.cookie.split(';').map(async (cookie) => {
							const trimmedCookie = cookie.trim();
							if (trimmedCookie.startsWith(`${auth.sessionCookieName}=`)) {
								const sessionId = trimmedCookie.split('=')[1];
								if (sessionId) {
									const foundUser = await auth.validateSession(sessionId);
									user = foundUser.user || null;
								}
							}
						})
					);
				}

				if (user) {
					ws.emit('userConnected', 'User Connected');

					ws.on('mouse', (data) => {
						if (user) {
							for (const room of rooms) {
								ws.to(room).emit('mouse', data);
							}
						}
					});

					ws.on('join', (data) => {
						//Leave existing rooms even if unsuccessful in joining a new room
						rooms.forEach((room) => {
							ws.leave(room);
						});
						if (user && allowedRooms.includes(data.room)) {
							ws.join(data.room);
							rooms.push(data.room);
							ws.emit('joined', data);
						} else {
							console.log('User Not Allowed To Join Room : ', data);
							ws.emit('error', `User Not Allowed To Join Room : ${data.room}`);
						}
					});
				}
			});
			wsServer.on('close', () => {
				console.log('Websocket Server Closed');
			});
		},
		(path) => /wss/.test(path)
	);
