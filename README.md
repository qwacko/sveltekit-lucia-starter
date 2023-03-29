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
- [TRPC](https://trpc.io/) with [TRPC-Sveltekit](https://icflorescu.github.io/trpc-sveltekit) to provide a centralised set of functions for use through the application. The TRPC router is setup to allow for protected functions, and also has demonstrations of loading data through the +page.ts and +page.server.ts , as well as directly reading data from the frontend.
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

## Features

- [Lucia](https://lucia-auth.com/) for authentication
- [SvelteKit-Superforms](https://github.com/ciscoheat/sveltekit-superforms) for form validation using [Zod](https://github.com/colinhacks/zod)

## Scripts

- `dev`: Start the development server
- `build`: Build the project for production
- `preview`: Preview the production build locally
- `test:unit`: Run unit tests using [Vitest](https://vitest.dev/)
- `lint`: Run Prettier and ESLint
- `format`: Run Prettier to format the code
