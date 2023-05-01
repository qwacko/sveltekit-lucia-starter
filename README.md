# SvelteKit-Lucia-Starter

The SvelteKit-Lucia-Starter is an all-inclusive SvelteKit template that comes pre-configured with a comprehensive set of features to kickstart your next application. Inspired by the [T3 Stack](https://create.t3.gg/), this starter kit provides a similar feature set with added functionality.

Includes the following features:

- Sveltekit installed and configured
- [Lucia](https://lucia-auth.com/) for authentication (configured to have a username / password authentication).
- Login / Logout Pages (using Lucia), including redirect to login page on attempt to access authenticated page. ALso a basic logged in user manageement (add / remove users, and update passwords, everyone is admin)
- Protected routes
- [Prisma](https://www.prisma.io/) to provide database (includes a SQLite schema for authentication / session management)
- [SvelteKit-Superforms](https://github.com/ciscoheat/sveltekit-superforms) for validation of actions, and all the other features provided by this library.
- [Zod](https://github.com/colinhacks/zod), which is used for form and trpc validation.
- [TRPC](https://trpc.io/) with [TRPC-Sveltekit](https://icflorescu.github.io/trpc-sveltekit) to provide a centralised set of functions for use through the application. The TRPC router is setup to allow for protected functions (with included demonstrations)
- A working staged DockerFile and docker-compose file are provided.
- unplugin-icons (https://github.com/antfu/unplugin-icons) is included, allowing access to over 10,000 icons.
- Vitest is included, however there are no tests setup and functioning
- TailwindCSS is _NOT_ included, however the template has been tested to work with svelte-add to add tailwind.
- Environment Variable Validation (using Zod)
- Basic logging setup.

## Getting started

To get started with SvelteKit-Lucia-Starter, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/qwacko/sveltekit-lucia-starter.git
   ```

2. Install the dependencies:

   ```bash
   cd sveltekit-lucia-starter
   pnpm install
   ```

3. Replace the example env file:

   ```bash
   mv .env.example .env
   ```

4. Create a new Prisma migration:

   ```bash
   npx prisma migrate dev --name init
   ```

5. Start the development server:

   ```bash
   pnpm dev
   ```

## Production

This template is tested to work with Docker using the provided Dockerfile. It possibly may work with a service such as Vercel or Netlify, however there may be significant changes (Prisma, Sveltekit Adapter, Auth Library Crypto etc..) and I haven't tested it.

Recommendation is to stick with Docker (or possibly node) unless you are knowledgable in the environment you are planning on deploying to.

## Envinroment Variables

The following environemnt variables are included
| Variable | Purpose |
| ------------- | ------------- |
|ORIGIN| Used In Production Only. Indicates the origin for all node routing to work correctly|
|DATABASE_URL|Set the database URL. Used in both dev and production.|
|HTTPS|Sets whether the authentication cookie in production will be secure (require HTTPS) or not. A value of anything other than "TRUE" (or blank) will result in insecure cookies. No effect in dev|
|ALLOW_SIGNUP|Indicates whether to enable public signup following the first user creation. Set to "true" to enable this|
|DEV_OVERRIDE|Allows the authentication to be put into dev mode, which doesn't enforce secure cookies. This can be used if the service is to be accessed over a non-https route (i.e. IP Address)|
|CSRF_CHECK_ORIGIN|Allows CSFR to be disabled if necessary. Only disable if you know what you are doing and why you are disabling.|
|LOGGING|Allows logging to be turned on in production. Logging is always turned on in dev|
|LOGGING_CLASSES| Allows the different classes of logging to be enabled. The options are `ERROR`, `WARN`, `INFO`, `DEBUG`, `TRACE` (with a comma separated list allowing multiple to be enabled). Defaults to `ERROR,WARN,INFO`|

## Auth

Auth is handled by the `lucia-auth` library with the following information to guide the user of this template:

- Route guards have been implemented in the `hooks.server.ts` file rather than elsewhere. With the folder structure (seperate sections for `loggedIn`, `loggedOut`, and `open`) this makes it relatively easy to guard specific sections of the app. These route guards are used to redirect on login and logout.
- TRPC has a auth guard middleware as well (`lib/server/trpc/middleware/auth.ts`) that can be added to any TRPC endpoint that needs an authorised user to access. It will throw an unauthorised error if a user tries to access the endpoint.
- If you want the user information to be displayed on the page, then look at how the load function in `routes/(loggedIn)/user/+page.server.ts` is used to provide this information to the frontend.

## Tailwind

To keep the template as clean and widely useable as possible, Tailwind (or any other styling library) is not included.

In order to add tailwind, simple run the following command after cloning this repository:

`npx svelte-add@latest tailwindcss`

## Prisma

The prisma schema in `prisma/schema.prisma` is setup to only have enough configuration to allow for the user and session storage.
If the DB type is changed, then the migrations folder will need to be deleted / removed.

## Docker

A DockerFile has been created, that is a staged build (to reduce the final file size). A couple of things to consider:

- There is a `deps` stage and a `proddeps` stage, the "proddeps" will only install production dependencies to reduce final image size.
- The `docker-compose-example.yml` can be used as a starting point for a docker-compose file that should work.
- the `dockerEntrypoint.sh` script is used to perform prisma database migrations on startup prior to starting the image.

## TRPC

TRPC has been setup in a way that can be used as part of the frontend, backend, actions, load functions etc.. by using `trpc-sveltekit` library. Check out [the documentation on that library](https://github.com/icflorescu/trpc-sveltekit) to understand how the configuration works.

- Most of the TRPC server is prevented from being called from the frontend by being located in a `server` directory. The exception to this is the frontend client (for use on `+page.svelte` and `+page.ts`) which is outside of this folder to allow for calling from the frontend.
- As per the Auth section, there is an auth middleware to check the user has been provided. This is useful as a backstop to make sure that only authorised users can access specific TRPC endpoints regardless of where tehy are called from (Frontend or Server).
- Examples of how to use the TRPC router are provided in the `routes/(loggedIn)/user` page. With `+page.svelte` indicating a trpc query from the page, `+page.ts` indicating a load function, `+page.server.ts` showing how to call is on the server. With these different calling methods all application should be achievable.
- It is possible that an app could be configured to route all queries and mutations through TRPC for consistency regardless of where the call is coming from. Alternatiely TRPC could be removed entirely from the applicaiton, and rely on actions / load functions. It is up to the dev.

## Enviroment Variables

Enviroment Variables (At least the server side dynamic ones) are able to be validated using a zod data structure. This can be found in the file `lib/server/serverEnv.ts`.
For the CSRF protection, there is a line of code added to the file `svelte.config.js`

## Logging

To simplify logging a logging object is created, which allows for the same input context as a `console.log`, but also will prefix the server timestamp and log class (with the ability to enable / disable some or all logging using environment variables).

To log data use the following code:

```typescript
import { logging} from './logging';

...

logging.info('Server Environment:', serverEnv);
```

## Scripts

- `dev`: Start the development server
- `build`: Build the project for production
- `preview`: Preview the production build locally
- `test:unit`: Run unit tests using [Vitest](https://vitest.dev/)
- `lint`: Run Prettier and ESLint
- `format`: Run Prettier to format the code
- `check`: Run typescript check, and svelte-check of the code.
