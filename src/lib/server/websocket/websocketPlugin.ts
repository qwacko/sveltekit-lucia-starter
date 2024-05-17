import type { Plugin, PreviewServer, ViteDevServer } from 'vite';
import http from 'http';
import https from 'https';
import http2 from 'http2';

type Http = typeof http | typeof https | typeof http2;
type CreateServer = Http['createServer'];
type Server = ReturnType<CreateServer>;

const getHTTPServerGlobal = () => {
	if (useGlobal) {
		//@ts-ignore
		return global.httpSrv as Server | null | undefined;
	} else {
		return localHttpSrv;
	}
};

const setHTTPServerGlobal = (newValue: Server | null) => {
	if (!newValue) return;
	if (useGlobal) {
		//@ts-ignore
		global.httpSrv = newValue;
	} else {
		//@ts-ignore
		localHttpSrv = newValue;
	}
};

let useGlobal: boolean = false;
let localHttpSrv: Server | undefined | null;
let cb: ((s: Server) => void) | undefined;
let skipPath: ((url: string) => boolean) | undefined;
let rmPolkaHack: () => void;
const polkaHack = (srv: Server) => {
	const on = srv.on;
	// @ts-ignore
	srv.on = function (...args) {
		const name = args[0];
		if (name === 'request') {
			// @ts-ignore
			on.call(this, 'request', function (req, res) {
				if (!skip(req.url)) {
					// @ts-ignore
					args[1].call(this, req, res);
				}
			});
			rmPolkaHack = () => {
				srv.on = on;
			};
		} else {
			// @ts-ignore
			on.call(this, ...args);
		}
	} as typeof on;
};

const skip = (url?: string) => {
	if (!url || !skipPath) return;
	return skipPath(new URL(url, 'http://a.a').pathname);
};

const clean = [] as [CreateServer, Http][];
const hack = (target: Http) => {
	const gen = target.createServer;
	clean.push([gen, target]);
	// @ts-ignore
	target.createServer = function (...args) {
		clean.forEach(([b, a]) => {
			a.createServer = b;
		});
		// @ts-ignore
		const localSRV = gen.call(this, ...args);
		setHTTPServerGlobal(localSRV);
		polkaHack(localSRV);
		check();
		return localSRV;
	};
};

const check = () => {
	const localSrv = getHTTPServerGlobal();
	if (localSrv && cb) {
		setTimeout(() => {
			rmPolkaHack?.();
			// @ts-ignore
			cb(localSrv);
		});
	}
};

const handle = (data?: { global: boolean }) => {
	if (data) {
		useGlobal = data.global;
	}
	if (getHTTPServerGlobal()) return;
	hack(http);
	hack(https);
};

const devHandle = (server: ViteDevServer | PreviewServer) => {
	setHTTPServerGlobal(server.httpServer);
};

function WsPlugin({
	hmrPort,
	buildModification,
	global = false
}: {
	hmrPort?: number | false;
	buildModification?: string;
	global?: boolean;
} = {}) {
	useGlobal = global;
	const rep = buildModification
		? buildModification
		: `import {handle} from 'vite-sveltekit-node-ws';\nhandle(${global ? '{global: true}' : ''});`;
	return {
		name: 'vite-sveltekit-node-ws',
		config(cfg) {
			if (hmrPort === false) return;
			const s = (cfg.server = cfg.server || {});
			if (s.hmr === true || !s.hmr) s.hmr = {};
			s.hmr.port = hmrPort || (s.port || 57777) + 1;
		},
		async transform(code, id) {
			if (id.endsWith('@sveltejs/kit/src/runtime/server/index.js')) {
				return { code: code.replace(/([\s\S]*import.*?from.*?(['"]).*?\2;\n)/, `$1${rep}`) };
			}
			return null;
		},
		configurePreviewServer: devHandle,
		configureServer: devHandle
	} satisfies Plugin;
}

const useServer = ({
	callback,
	skip,
	global = false
}: {
	callback: (server: Server) => void;
	skip?: typeof skipPath;
	global?: boolean;
}) => {
	useGlobal = global;
	skipPath = skip;
	cb = callback;
	check();
};

export { useServer, handle };
export default WsPlugin;
