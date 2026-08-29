# Ledger

Ledger is a personal workspace web app for organizing notes, to-do lists, files, folders, and schedules in one clean dashboard. It is built as a Notion-inspired productivity app where users can sign in, create their own workspace content, and keep important information in one place.

## What The App Is About

Ledger helps users manage everyday work and study materials through a simple private dashboard. Instead of keeping notes, tasks, files, and schedules in separate places, the app brings them together inside one account-based workspace.

Users can create notes, build to-do lists, upload files, organize items into folders, and view scheduled events. The app also includes an admin area where an admin user can monitor workspace activity such as users, notes, lists, files, and total storage usage.

## Main Features

- User authentication with login and signup
- Personal dashboard for each user
- Notes management
- To-do list management
- Folder organization for notes and lists
- File upload and recent file viewing
- Schedule/calendar support
- Theme customization
- Admin dashboard for workspace overview
- Supabase-backed database and authentication

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- lucide-react icons
- date-fns

## Project Structure

```text
src/app              Main Next.js app routes
src/app/(auth)       Authentication pages
src/app/dashboard    User dashboard pages
src/app/admin        Admin workspace overview
src/app/actions      Server actions for app features
src/components       Reusable UI components
src/lib              Supabase clients and shared types
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the app in your browser:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev      Start the development server
npm run build    Build the production app
npm run start    Start the production server
npm run lint     Run ESLint
```

## Notes

This project uses Supabase, so it needs the correct Supabase environment variables and database tables configured before the full app can run properly.
