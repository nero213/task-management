This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Vercel Deployment Live URL

```bash
https://task-management-coral-xi.vercel.app/
```

![website](./images/image.png)

## Documentation

A core architectural decision was organizing the application logic into a modular service layer located within `services/tasks/`. Rather than embedding direct API calls or Supabase database client queries directly inside React components, each operation (Read, Create, and Update) is encapsulated into its own dedicated async function (`getTasks`, `addTask`, `updateTask`). This isolation keeps our client-side React components lean, highly readable, and solely focused on managing UI states and user interactions. Furthermore, exporting these module functions via a central index file `(services/tasks/index.ts)` provides a clean public API surface that simplifies future refactoring, unit testing, and maintainability.

To maintain runtime and compile-time reliability across the application, strict TypeScript typings were established in `types/database.ts`. Defining explicit interface contracts and custom union types—such as `TaskStatus` for PostgreSQL enum alignment—guarantees that state transformations and database mutations strictly adhere to expected schemas. For the presentation layer, standardizing on Tailwind CSS allowed us to eliminate bulky inline styles and redundant custom CSS files in favor of utility-first styling. This design approach ensures responsive layouts, consistent color tokens, immediate visual feedback (such as inline status changes and disabled button states during async operations), and optimal production bundle sizes.

To accelerate the implementation lifecycle and ensure deployment readiness, AI pairing tools were heavily leveraged throughout the design and execution phases. AI assistance was utilized to rapidly prototype, enforce consistency in TypeScript interface structures, and generate optimized utility patterns. Crucially, during integration, AI-driven diagnostics helped quickly identify and resolve schema misalignment issues between the client application and PostgreSQL database enums, drastically reducing debugging overhead.
