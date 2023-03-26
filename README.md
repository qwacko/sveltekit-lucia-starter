```
# SvelteKit-Lucia-Starter

SvelteKit-Lucia-Starter is a SvelteKit starter project that includes [Lucia](https://lucia.js.org/) for authentication and [SvelteKit-Superforms](https://github.com/hamatti/sveltekit-superforms) for form validation using [Zod](https://github.com/vriad/zod).

## Getting started

To get started with SvelteKit-Lucia-Starter, follow these steps:

1. Clone the repository:

```

git clone https://github.com/yourusername/sveltekit-lucia-starter.git

```

2. Install the dependencies:

```

cd sveltekit-lucia-starter
pnpm install

```

3. Create a new Prisma migration:

```

npx prisma migrate dev --name init

```

4. Start the development server:

```

pnpm dev

```

## Features

- [Lucia](https://lucia.js.org/) for authentication
- [SvelteKit-Superforms](https://github.com/hamatti/sveltekit-superforms) for form validation using [Zod](https://github.com/vriad/zod)

## Scripts

- `dev`: Start the development server
- `build`: Build the project for production
- `preview`: Preview the production build locally
- `test:unit`: Run unit tests using [Vitest](https://github.com/egoist/vitest)
- `lint`: Run Prettier and ESLint
- `format`: Run Prettier to format the code
```
