# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

- `pnpm dev` - Start development server (includes database migration)
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm check` - Run TypeScript and Svelte checks
- `pnpm lint` - Run Prettier and ESLint checks
- `pnpm format` - Format code with Prettier
- `pnpm test` - Run all tests (integration + unit)
- `pnpm test:unit` - Run unit tests with Vitest
- `pnpm test:integration` - Run Playwright integration tests

## Database Commands

- `pnpm db:generate` - Generate Drizzle migrations from schema changes
- `pnpm db:studio` - Open Drizzle Studio for database exploration
- `pnpm db:custom` - Create custom blank migration
- `pnpm db:undo` - Undo specific migration step

## Architecture Overview

This is a full-stack SvelteKit application with authentication, real-time features, and PWA capabilities.

### Authentication

- **Better Auth** (migrated from Lucia) handles authentication with email/password
- Auth configuration in `src/lib/server/auth/auth.ts`
- Uses Drizzle adapter with SQLite database
- Session management handled via SvelteKit cookies
- Route protection via `authGuard` system in `src/lib/authGuard/authGuardConfig.ts`

### Database Architecture

- **Drizzle ORM** with SQLite (supports LibSQL for better migration support)
- Schema defined in `src/lib/server/db/schema/`
- Migrations stored in `src/lib/server/db/migrations/`
- Database file location controlled by `DATABASE_FILE` env var
- Automatic migrations run on server startup

### Route Structure

- `(loggedIn)/` - Protected routes requiring authentication
- `(loggedOut)/` - Public routes for unauthenticated users
- `(open)/` - Open routes accessible to all users
- Route guards implemented via hooks.server.ts and authGuard system

### Real-time Features

- **Server-Sent Events (SSE)** - Implemented in `sse/[id]` routes with unstorage for state management
- **WebSockets** - Socket.io integration with room-based functionality in `ws/[id]` routes
- WebSocket server in `src/lib/server/websocket/wsServer.ts`

### Key Libraries & Features

- **SvelteKit** with Node.js adapter for production
- **Tailwind CSS** for styling with custom components
- **Zod** for schema validation (forms, env vars, route params)
- **sveltekit-superforms** for form handling
- **skGuard** and **skRoutes** for route protection and parameter validation
- **Vite PWA** plugin for Progressive Web App functionality
- **unplugin-icons** providing 10,000+ icons
- **node-schedule** for cron-like functionality (requires long-running process)

### Component Organization

- Custom components in `src/lib/components/custom/`
- Base UI components (Button, Input, Label, Card components) in `src/lib/components/`
- Reusable form components (TextInput, ErrorText) in `src/lib/components/`

### Environment Variables

Required environment variables are validated using Zod in `src/lib/server/serverEnv.ts`. Key variables:

- `DATABASE_FILE` - Database file location (default: ./db.db)
- `ALLOW_SIGNUP` - Enable public signup after first user creation
- `ORIGIN` - Required in production for proper routing
- `DEV_OVERRIDE` - Disable secure cookies for non-HTTPS development
- `LOGGING` and `LOGGING_CLASSES` - Control server-side logging

### First-time Setup

1. Copy `.env.example` to `.env`
2. Run `pnpm dev` (automatically creates and migrates database)
3. First user creation dialog appears if no admin users exist
4. Update PWA manifest in `vite.config.ts` and replace `static/logo.svg`, then run `pnpm generate-pwa-assets`

### Custom Components

The project uses custom UI components instead of component libraries:

- **Button** - Supports variants (default, destructive, outline, secondary, ghost, link) and sizes
- **Input** - Basic input component with file upload support
- **Label** - Form label component
- **Card components** - Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- **TextInput** - Composite component combining Input + Label + ErrorText

### Testing

- Unit tests using Vitest
- Integration tests using Playwright
- Test files should match `src/**/*.{test,spec}.{js,ts}` pattern

### Docker Support

- Multi-stage Dockerfile included for production builds
- Example docker-compose configuration in `docker-compose-example.yml`
- Entry point script in `dockerEntrypoint.sh` for startup customization

### Testing Tools

- The environment has Puppeteer and Chromium installed, use those for any visual / functional checks
