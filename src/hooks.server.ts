import { authGuard } from '$lib/authGuard/authGuardConfig';
import { initateCronJobs } from '$lib/server/cron/cron';
import { dbNoAdmins } from '$lib/server/db/actions/firstUser';

import { auth } from '$lib/server/lucia';
// import { initialiseSocketServer } from '$lib/server/websocket/websockets';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { useServer } from '$lib/server/websocket/websocketPlugin';
import { Server } from 'socket.io';

useServer({
	callback: (server) => {
		console.log('Initialising Websocker Server!');
		const wsServer = new Server(server, { path: '/wss/' });
		console.log('Websocket Server Initialised');
		wsServer.on('connect', (ws) => {
			const rooms: string[] = [];

			console.log('Websocket Server Received A Connection!');
			ws.on('mouse', (data) => {
				for (const room of rooms) {
					ws.to(room).emit('mouse', data);
				}
			});
			ws.on('join', (data) => {
				console.log('Joining Room : ', data);
				ws.join(data.room);
				rooms.push(data.room);
			});
		});
		wsServer.on('close', () => {
			console.log('Websocket Server Closed');
		});
	},
	skip: (path) => /wss/.test(path)
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const runningJobs = initateCronJobs();

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(auth.sessionCookieName);
	if (!sessionId) {
		event.locals.user = undefined;
		event.locals.session = undefined;
		return resolve(event);
	}

	const { session, user } = await auth.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = auth.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = auth.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	event.locals.user = user || undefined;
	event.locals.session = session || undefined;
	return resolve(event);
};

export const handleRoute: Handle = async ({ event, resolve }) => {
	const noAdmin = await dbNoAdmins();

	if (!event.route.id) {
		redirect(302, '/login');
	}
	if (event.route.id !== '/(loggedOut)/firstUser' && noAdmin) {
		redirect(302, '/firstUser');
	}

	if (event.route.id) {
		authGuard(event as Parameters<typeof authGuard>[0]);
	}

	return await resolve(event);
};

// export const handleWS: Handle = async (input) => {
// 	if (!serverInstance) {
// 		initiateSocketServer();
// 	}

// 	// console.log('GLobal Test Data : ', global.testData);

// 	// console.log('Handle WS Keys', Object.keys(input));
// 	// console.log('WS Event Keys', Object.keys(input.event));

// 	// console.log('Request Keys', Object.keys(input.event.request));
// 	// console.log('Request Informaiton : ', input.event.request);

// 	return await input.resolve(input.event);
// };

export const handle = sequence(handleAuth, handleRoute);
