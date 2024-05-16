import type { Plugin, PreviewServer, ViteDevServer } from 'vite';
import http from 'http';
import https from 'https';
import http2 from 'http2';
import { set } from 'zod';

type Http = typeof http | typeof https | typeof http2;
type CreateServer = Http['createServer'];
type Server = ReturnType<CreateServer>;

// type getServerSignature = () => Server | null | undefined;
// type setServerSignature = (newValue: Server | null) => void;

//@ts-ignore
const getHTTPServerGlobal = () => global.httpSrv as Server | null | undefined;
const setHTTPServerGlobal = (newValue: Server | null) => {
	if (!newValue) return;
	//@ts-ignore
	global.httpSrv = newValue;
};

// let srv: Server | undefined | null;
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

const handle = () => {
	if (getHTTPServerGlobal()) return;
	hack(http);
	hack(https);
};

const devHandle = (server: ViteDevServer | PreviewServer) => {
	setHTTPServerGlobal(server.httpServer);
};

function WsPlugin({
	hmrPort,
	buildModification = `import {handle} from 'vite-sveltekit-node-ws';\nhandle();`
}: {
	hmrPort?: number | false;
	buildModification?: string;
} = {}) {
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
				const rep = buildModification;
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
	skip
}: {
	callback: (server: Server) => void;
	skip?: typeof skipPath;
}) => {
	skipPath = skip;
	cb = callback;
	check();
};

export { useServer, handle };
export default WsPlugin;
