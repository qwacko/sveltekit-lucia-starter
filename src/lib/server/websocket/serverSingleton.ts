import http from 'http';
import https from 'https';
import http2 from 'http2';
import { Server as SocketIOServer } from 'socket.io';
import { nanoid } from 'nanoid';

type Http = typeof http | typeof https | typeof http2;
type CreateServer = Http['createServer'];
type Server = ReturnType<CreateServer>;

class ServerSingleton {
	private static instance: ServerSingleton;
	public serverInstance: Server | null = null;
	private skipPath: ((url: string) => boolean) | undefined;
	private id = nanoid();
	// private rmPolkaHack: () => void;

	private constructor() {}

	public static getInstance(): ServerSingleton {
		if (!global.instance) {
			global.instance = new ServerSingleton();
		}

		return global.instance as any as ServerSingleton;
	}

	public initializeServer() {
		console.log(this.id, 'initializing server');
		if (this.serverInstance) return;
		this.hack(http);
		this.hack(https);
	}

	private hack(target: Http) {
		const gen = target.createServer;
		target.createServer = (...args: any[]) => {
			if (this.serverInstance) return this.serverInstance;
			this.serverInstance = gen.call(this, ...args);
			this.polkaHack(this.serverInstance);
			return this.serverInstance;
		};
	}

	private polkaHack(srv: Server) {
		const on = srv.on;
		srv.on = (...args: any[]) => {
			const name = args[0];
			if (name === 'request') {
				on.call(srv, 'request', (req, res) => {
					if (!this.skip(req.url)) {
						args[1].call(this, req, res);
					}
				});
				this.rmPolkaHack = () => {
					srv.on = on;
				};
			} else {
				on.call(srv, ...args);
			}
		};
	}

	private skip(url?: string) {
		if (!url || !this.skipPath) return false;
		return this.skipPath(new URL(url, 'http://a.a').pathname);
	}

	public initializeSocketIO(path: string) {
		console.log(this.id, 'initializing socket io');
		if (!this.serverInstance) return;
		console.log(this.id, 'server instance exists');
		const io = new SocketIOServer(this.serverInstance, { path });
		io.on('connection', (socket) => {
			console.log('a user connected');
			socket.on('disconnect', () => {
				console.log('user disconnected');
			});
		});
	}

	public setSkipPath(skipPath: (url: string) => boolean) {
		x;
		this.skipPath = skipPath;
	}

	public setCallback(callback: (server: Server) => void) {
		if (this.serverInstance) {
			callback(this.serverInstance);
		} else {
			setTimeout(() => this.setCallback(callback), 1000);
		}
	}
}

export default ServerSingleton;
