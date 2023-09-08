# SvelteKit-Lucia-Starter

## 2023-08-26 - Update

I have made a few changes to this starter. The key changes I have made from the previous version:

- Changed from Prisma to Drizzle for the ORM and Migrations. This makes the docker compose file much simpler as the Drizzle migration happens in the server on startup. Also I like the approach and performance of Drizzle.
- Removed tRPC. This was because I found that the actions and load functions of sveltekit are enough for most of my needs and trying to force tRPC into the mix ends up making things more complex for the simple functionality this template is intended for. Will consider re-adding in the future.
- Added validation / type checking functionality for searchParams. COuld possibly spin this into a standalone library.
- Added Cron functionality (only work on long-running processes)
- Added backups / restore (only works with SQLite, and automatic backups only work if Cron function is working).
- Configured PWA to work.

## 2023-09-08 - Improved Route Guard Functionality

Update Route Guard functionality to be more generic and able to handle a wider range of conditions (excluded routes, post handling).

## Overview

The SvelteKit-Lucia-Starter is an all-inclusive SvelteKit template that comes pre-configured with a comprehensive set of features to kickstart your next application. Inspired by the [T3 Stack](https://create.t3.gg/), this starter kit provides a similar feature set with added functionality.

Includes the following features:

- Sveltekit installed and configured
- PWA Configured using [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- [Lucia](https://lucia-auth.com/) for authentication (configured to have a username / password authentication).
- Login / Logout Pages (using Lucia), including redirect to login page on attempt to access authenticated page. ALso a basic logged in user manageement (add / remove users, and update passwords, everyone is admin)
- Protected routes. Custom logic to validate users against routes. Allows validation of load functions, hooks, and server actions.
- SearchParams validation (using Zod) using custom logic.
- [Drizzle ORM](https://orm.drizzle.team) provides database integration. Including a SQLite schema for authentication / session management, and build in automatic migrations. Also includes package.json scripts for generating migrations, and running Drizzle Studio.
- Cron-like functionality using [node-schedule](https://github.com/node-schedule/node-schedule) which allows for configuration of automated scripts. Note that this required long-running process and therefore won't work well in a serverless environment.
- [SvelteKit-Superforms](https://github.com/ciscoheat/sveltekit-superforms) for validation of actions, and all the other features provided by this library.
- [Zod](https://github.com/colinhacks/zod), which is used for form and trpc validation.
- A working staged DockerFile and docker-compose file are provided.
- Automatic scheduled Backups of the database.
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

4. Start the development server (this will create and migrate the SQLite database):

   ```bash
   pnpm dev
   ```

## Production

This template is tested to work with Docker using the provided Dockerfile. It possibly may work with a service such as Vercel or Netlify, however there may be significant changes (Prisma, Sveltekit Adapter, Auth Library Crypto, Cron Jobs etc..) and I haven't tested it.

Recommendation is to stick with Docker (or possibly node) unless you are knowledgable in the environment you are planning on deploying to.

## Envinroment Variables

The following environemnt variables are included
| Variable | Purpose |
| ------------- | ------------- |
|ORIGIN| Used In Production Only. Indicates the origin for all node routing to work correctly|
|DATABASE_FILE|Set the database file location. Used in both dev and production.|
|ALLOW_SIGNUP|Indicates whether to enable public signup following the first user creation. Set to "true" to enable this|
|DEV_OVERRIDE|Allows the authentication to be put into dev mode, which doesn't enforce secure cookies. This can be used if the service is to be accessed over a non-https route (i.e. IP Address)|
|CSRF_CHECK_ORIGIN|Allows CSFR to be disabled if necessary. Only disable if you know what you are doing and why you are disabling.|
|LOGGING|Allows logging to be turned on in production. Logging is always turned on in dev|
|LOGGING_CLASSES| Allows the different classes of logging to be enabled. The options are `ERROR`, `WARN`, `INFO`, `DEBUG`, `TRACE` (with a comma separated list allowing multiple to be enabled). Defaults to `ERROR,WARN,INFO`|
|BACKUP_DIR| Sets the location of the automated and manual backups. Defaults to ./backup|
|BACKUP_SCHEDULE| Cron string to set the Backup schedule. Defaults to "0 0 \* \* \*" (Midnight daily)|

## Auth

Auth is handled by the `lucia-auth` library with username and password authentication. Includes each user able to be admin or not. Also includes automatic redirection to the first user creation dialog if the first user hasn't already been created.

## Route Guards

Custom logic has been developed (located in `/lib/server/authGuard/authGuard.ts`) which provides functionality to guard routes in the following locations

- Hooks
- Page Load Functions
- Page server actions

This is all centrally configured (demonstrated in `/lib/server/authGuard/authGuardConfig.ts`) to allow a common configuration to be used throughout, avoid repetition, and ease review of route access.

There is custom functionality for specific use cases (i.e. redirection to first user) handled directly within the hooks.

## Portable Web App

The PWA is configured to function correctly, however to work for the specific app it wil need additional configuration:

- Edit the app details (manifest) in `vite.config.ts` to reflect the name of the app.
- Replace `static/logo.svg` with the app icon, and runn `pnpm generate-pwa-assets` to generate all the necessary icons from this file

## Tailwind

To keep the template as clean and widely useable as possible, Tailwind (or any other styling library) is not included.

In order to add tailwind, simple run the following command after cloning this repository:

`npx svelte-add@latest tailwindcss`

## Drizzle ORM

The Drizzle ORM schema is configured in `src/lib/server/db/schema` and all files should be compiled into `index.ts` to allow for the application to use this correctly. Migration files are stored in `src/lib/server/db/migrations`.
If you want different information related to the user (currently only `username` and `admin`) to be available through lucia-auth, you will need to modify the `app.d.ts` file and `src/lib/server/lucia.ts`, as these values are not related to the drizzle schema.

The following scripts are available in relation to drizzle:

- `pnpm db:generate` : Generates the necessary migrations from the current schema.
- `pnpm db:studio` : Executes drizzle studio to allow for db exploration.

## Search Params Validation

There is a custom build set of functions to use Zod to validate and transform search parameters, and actually make them useful. The core of the functionality is stored in the `src/lib/sveltekitSearchParams.ts` file.
A demonstration of how the logic is supposed to work is included in thr `/params` page (with the logic in `src/routes/(open)/params`).

## Docker

A DockerFile has been created, that is a staged build (to reduce the final file size). A couple of things to consider:

The `docker-compose-example.yml` can be used as a starting point for a docker-compose file that should work.

- the `dockerEntrypoint.sh` script is pre-prepared for if you needed to add any specific actions on server start.

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

## Backups

There is a single function (`backupDB`) for backing up the database included in the file `src/lib/server/db/db.ts`, this will generate a db dump of the current state into a folder defined in environment variable `BACKUP_DIR`.
There is a preconfigured cron job to execute this function every day, the schedule is configured by the Environment variable `BACKUP_SCHEDULE` which should be a cron schedule (this isn't validated, the text is used directly).

## Scripts

- `dev`: Start the development server
- `build`: Build the project for production
- `preview`: Preview the production build locally
- `test:unit`: Run unit tests using [Vitest](https://vitest.dev/)
- `lint`: Run Prettier and ESLint
- `format`: Run Prettier to format the code
- `check`: Run typescript check, and svelte-check of the code.
- `db:generate`: Reads the current drizzle schema and updates the migrations.
- `db:studio`: Runs the Drizzle Studio to allow the user to explore (and modify) the db data.
- `drizzle-kit`: Gives full access to the drizzle-kit functionality.
