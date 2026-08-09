# TaskMate — Task Management System Prototype

TaskMate is a full-stack task-management dashboard prototype built with Next.js and TypeScript. The project explores secure account workflows, protected application routes, role-aware access, user settings, and a responsive dashboard interface backed by PostgreSQL through Prisma.

> **Project status:** Active prototype / portfolio code sample. The authentication and account-management foundation is implemented. Some task-management pages, dashboard values, and analytics views currently use scaffolded or sample content and remain to be connected to persistent project and task data.

## Highlights

- Credentials-based registration and sign-in
- Email-verification flow
- Password-reset flow
- Optional email-based two-factor authentication
- Password hashing with `bcryptjs`
- Protected routes and login redirects through middleware
- JWT-based sessions with Auth.js / NextAuth.js
- User and administrator roles
- Client- and server-side authorization examples
- Profile, password, email, role, and 2FA settings
- Responsive dashboard with charts, date-range controls, tables, and navigation
- PostgreSQL data modeling and access through Prisma ORM
- Form validation with Zod and React Hook Form

## Technology Stack

| Area | Technologies |
| --- | --- |
| Framework | Next.js 14 (App Router), React 18, TypeScript |
| Authentication | Auth.js / NextAuth.js v5 beta, Prisma adapter, bcryptjs |
| Database | PostgreSQL, Prisma ORM |
| UI | Tailwind CSS, shadcn/ui-style Radix UI components, Lucide React |
| Forms and validation | React Hook Form, Zod |
| Tables and charts | TanStack Table, Recharts |
| Email | Resend |

## Implemented Functionality

### Authentication and account security

- Register with a name, email address, and password
- Verify an email address before credentials-based sign-in
- Sign in and sign out with protected-session handling
- Request a password-reset link and set a new password
- Enable or disable email-based two-factor authentication
- Hash passwords before storage

### Authorization

- Protect non-public routes using Next.js middleware
- Redirect unauthenticated visitors to the login page
- Attach user ID, role, OAuth status, and 2FA status to the session
- Demonstrate role checks through a client-side role gate, an API route, and a server action

### Dashboard and settings

- Responsive dashboard shell with navigation, summary cards, charts, accomplishments, date selection, and user controls
- Member table and reusable data-table components
- Account settings for name, email, password, role, and 2FA preferences

## Prototype Scope

The repository currently focuses on the platform foundation. The following areas are planned or partially scaffolded:

- Persistent projects, tasks, teams, reports, calendar entries, and chat data
- CRUD operations for task and project records
- Live dashboard metrics and analytics
- Production-ready authorization rules for role changes
- Automated tests and deployment configuration

The current dashboard numbers and chart data are examples for demonstrating the interface; they are not calculated from production records.

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm
- A PostgreSQL database
- A Resend API key and verified sending configuration for email workflows

### 1. Clone the repository

```bash
git clone https://github.com/billenriquez/task-management-system.git
cd task-management-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
AUTH_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
RESEND_API_KEY="replace-with-your-resend-api-key"
```

Do not commit `.env` files or real credentials. Depending on the database provider, `DATABASE_URL` and `DIRECT_URL` may use different connection endpoints.

### 4. Generate the Prisma client and create the database tables

```bash
npx prisma generate
npx prisma db push
```

For a migration-based workflow, use `npx prisma migrate dev` instead of `prisma db push`.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
npm run dev     # Start the development server
npm run build   # Create a production build
npm run start   # Run the production build
npm run lint    # Run Next.js ESLint checks
```

## Project Structure

```text
actions/       Server actions for authentication and settings
app/           App Router pages, layouts, protected routes, and API routes
components/    Authentication, dashboard, table, navigation, and UI components
constants/     Navigation and sample member data
data/          Prisma data-access helpers
hooks/         Session and form hooks
lib/           Database, authentication, email, token, and utility helpers
prisma/        PostgreSQL schema
schemas/       Zod validation schemas
types/         Shared TypeScript types
```

## Security Notes

- Use unique, non-production credentials during local development.
- Replace the Resend development sender with a verified domain before production use.
- Remove console logging of verification links, password-reset links, email addresses, and 2FA tokens before deployment.
- Restrict role changes to authorized administrators before production use.
- Review and harden rate limiting, session configuration, email delivery, error handling, and authorization before exposing the application publicly.

## Roadmap

- Add project and task database models
- Implement project and task CRUD workflows
- Add assignment, status, priority, and due-date tracking
- Connect dashboard charts and metrics to stored data
- Complete teams, reports, calendar, and chat modules
- Add unit, integration, and end-to-end tests
- Add screenshots and a hosted demonstration

## Author

Developed by [Bill Enriquez](https://github.com/billenriquez) as a full-stack application prototype and portfolio code sample.
