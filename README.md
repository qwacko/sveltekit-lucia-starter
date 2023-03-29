# SvelteKit-Lucia-Starter

SvelteKit-Lucia-Starter is a SvelteKit starter project that includes all the functionality that I like. It is kind of like the [T3 Stack](https://create.t3.gg/) in some ways as it includes a similar feature set.

Includes the following features:

- Sveltekit installed and configured
- [Tailwind](https://tailwindcss.com/) for styling / layout.
- [Lucia](https://lucia-auth.com/) for authentication (configured to have a username / password authentication).
- Login / Logout Pages (using Lucia), including redirect to login page on attempt to access authenticated page.
- Protected routes
- [Prisma](https://www.prisma.io/) to provide database (includes a SQLite schema for authentication / session management)
- [SvelteKit-Superforms](https://github.com/ciscoheat/sveltekit-superforms) for validation of actions, and all the other features provided by this library.
- [Zod](https://github.com/colinhacks/zod), which is used for form and trpc validation.
- [TRPC](https://trpc.io/) with [TRPC-Sveltekit](https://icflorescu.github.io/trpc-sveltekit) to provide a centralised set of functions for use through the application. The TRPC router is setup to allow for protected functions (with incuded demonstrations)
- A working staged DockerFile and docker-compose file are provided.
- Vitest is included, however there are no tests setup and functioning

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

3. Create a new Prisma migration:

   ```bash
   npx prisma migrate dev --name init
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

## Envinroment Variables

The following environemnt variables are included
| Variable | Purpose |
| ------------- | ------------- |
|ORIGIN| Used In Production Only. Indicates the origin for all node routing to work correctly|
|DATABASE_URL|Set the database URL. Used in both dev and production.|
|HTTPS|Sets whether the authentication cookie in production will be secure (require HTTPS) or not. A value of anything other than "TRUE" (or blank) will result in insecure cookies. No effect in dev|

## Auth

Auth is handled by the `lucia-auth` library with the following information to guide the user of this template:

- Route guards have been implemented in the `hooks.server.ts` file rather than elsewhere. With the folder structure (seperate sections for `loggedIn`, `loggedOut`, and `open`) this makes it relativelt easy to guard specific sections of the app. These route guards are used to redirect on login and logout.
- TRPC has a auth guard middleware as well (`lib/server/trpc/middleware/auth.ts`) that can be added to any TRPC endpoint that needs an authorised user to access. It will throw an unauthorised error if a user trys to access the endpoint.
- If you want the user information to be displayed on the page, then look at how the load function in `routes/(loggedIn)/user/+page.server.ts` are used to provide this information to the frontend.

## Prisma

The prisma schema in `prisma/schema.prisma` is setup to only have enough configuration to allow for the user and session storage.
If the DB type is changed, then the migrations folder will need to be deleted / removed.

## Docker

A DockerFile has been created, that is a staged build (to reduce the final file size). A couple of things to consider:

- There is a `deps` stage and a `proddeps` stage, the "proddeps" will only install production dependencies to reduce final image size.
- The `docker-compose-example.yml` can be used as a starting point for a docker-compose file that should work.
- the `dockerEntrypoint.sh` script is used to perform prisma database migrations on startup prior to starting the image.

## TRPC

TRPC has been setup in a way that can be used as part of teh frontend, backend, actions, load functions etc.. by using `trpc-sveltekit` library. Check out the documentatino on that library to understand how the configuration works.

- Most of the TRPC server is prevented from being called from teh frontend by being located in a `server` directory. The exception to this is the frontend client (for use on `+page.svelte` and `+page.ts`) which is outside of this folder to allow for calling from the frontend.
- As per the Auth section, there is an auth middleware to check the user has been provided. This is useful as a backstop to make sure that only authorised users can access specific TRPC endpoints regardless of where tehy are called from (Frontend or Server).
- Examples of how to use the TRPC router are provided in the `routes/(loggedIn)/user` page. With `+page.svelte` indicating a trpc query from the page, `+page.ts` indicating a load function, `+page.server.ts` showing how to call is on the server. With these different calling methods all application should be achievable.

## Scripts

- `dev`: Start the development server
- `build`: Build the project for production
- `preview`: Preview the production build locally
- `test:unit`: Run unit tests using [Vitest](https://vitest.dev/)
- `lint`: Run Prettier and ESLint
- `format`: Run Prettier to format the code
