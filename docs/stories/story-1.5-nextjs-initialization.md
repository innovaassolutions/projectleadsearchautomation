# Story 1.5: Initialize NextJS Application

> **Epic**: Epic 1 - Foundation & Core Infrastructure
> **Story ID**: 1.5
> **Status**: Ready for Development
> **Estimated Time**: 3-4 hours

---

## Status

Done

---

## Story

**As a** developer
**I want** NextJS 15+ app initialized with Tailwind and shadcn/ui
**So that** I can build the frontend interface

---

## Acceptance Criteria

1. NextJS 15+ initialized in `/apps/web` using App Router
2. TypeScript configured with strict mode enabled
3. Tailwind CSS v3.x installed and configured
4. shadcn/ui initialized with default theme configuration
5. Base UI components installed from shadcn/ui:
   - Button, Card, Input, Label, Badge, Separator, Skeleton
6. Font configuration using Next.js font optimization (Inter font)
7. App router structure created (`/app` directory)
8. Root layout created (`/app/layout.tsx`) with basic navigation
9. Home page created (`/app/page.tsx`) with "System Operational" message
10. Development server runs successfully: `npm run dev --workspace=apps/web`
11. Hot reload verified working (edit page, see changes)
12. Environment variables loaded from `.env.local` (verified with API URL)
13. Responsive design verified (desktop 1920px, tablet 768px, mobile 375px)

---

## Tasks / Subtasks

- [x] **Task 1: Initialize Next.js application** (AC: 1, 2)
  - [ ] 1.1 Navigate to project root
  - [ ] 1.2 Run: `npx create-next-app@latest apps/web`
  - [ ] 1.3 Select options:
    - [ ] TypeScript: Yes
    - [ ] ESLint: Yes
    - [ ] Tailwind CSS: Yes
    - [ ] `src/` directory: No
    - [ ] App Router: Yes
    - [ ] Import alias: `@/*`
  - [ ] 1.4 Wait for installation to complete
  - [ ] 1.5 Verify `apps/web/package.json` created
  - [ ] 1.6 Verify `apps/web/app/` directory exists
  - [ ] 1.7 Update `apps/web/package.json` name to `@job-app/web`
  - [ ] 1.8 Enable TypeScript strict mode in `tsconfig.json`

- [x] **Task 2: Configure Tailwind CSS** (AC: 3)
  - [ ] 2.1 Verify `tailwind.config.ts` exists in `/apps/web`
  - [ ] 2.2 Verify `app/globals.css` has Tailwind directives
  - [ ] 2.3 Update `tailwind.config.ts` content paths to include all component directories
  - [ ] 2.4 Add custom theme colors (optional for now, shadcn will override)
  - [ ] 2.5 Test Tailwind by adding utility classes to page.tsx
  - [ ] 2.6 Run dev server: `npm run dev --workspace=apps/web`
  - [ ] 2.7 Verify Tailwind styles apply in browser

- [x] **Task 3: Initialize shadcn/ui** (AC: 4)
  - [ ] 3.1 Run: `cd apps/web && npx shadcn@latest init`
  - [ ] 3.2 Select options:
    - [ ] Style: Default
    - [ ] Base color: Slate
    - [ ] CSS variables: Yes
  - [ ] 3.3 Verify `components/ui/` directory created
  - [ ] 3.4 Verify `lib/utils.ts` created (cn() utility)
  - [ ] 3.5 Verify `tailwind.config.ts` updated with shadcn theme
  - [ ] 3.6 Verify `app/globals.css` updated with CSS variables
  - [ ] 3.7 Install lucide-react: `npm install lucide-react --workspace=apps/web`

- [x] **Task 4: Install shadcn/ui base components** (AC: 5)
  - [ ] 4.1 Install Button: `cd apps/web && npx shadcn@latest add button`
  - [ ] 4.2 Install Card: `npx shadcn@latest add card`
  - [ ] 4.3 Install Input: `npx shadcn@latest add input`
  - [ ] 4.4 Install Label: `npx shadcn@latest add label`
  - [ ] 4.5 Install Badge: `npx shadcn@latest add badge`
  - [ ] 4.6 Install Separator: `npx shadcn@latest add separator`
  - [ ] 4.7 Install Skeleton: `npx shadcn@latest add skeleton`
  - [ ] 4.8 Verify all components exist in `components/ui/`
  - [ ] 4.9 Test import: Add `import { Button } from '@/components/ui/button'` to page.tsx

- [x] **Task 5: Configure Next.js fonts** (AC: 6)
  - [ ] 5.1 Open `app/layout.tsx`
  - [ ] 5.2 Import Inter font: `import { Inter } from 'next/font/google'`
  - [ ] 5.3 Initialize Inter: `const inter = Inter({ subsets: ['latin'] })`
  - [ ] 5.4 Add font to html tag: `<html className={inter.className}>`
  - [ ] 5.5 Verify font loads in browser (inspect Network tab)
  - [ ] 5.6 Test font rendering on page

- [x] **Task 6: Create root layout and navigation** (AC: 7, 8)
  - [ ] 6.1 Open `app/layout.tsx`
  - [ ] 6.2 Update metadata: title "Job Application System", description from PRD
  - [ ] 6.3 Create `components/layout/header.tsx` component
  - [ ] 6.4 Add navigation links: Home, Dashboard, Jobs, Projects
  - [ ] 6.5 Style header with Tailwind (flex, padding, border)
  - [ ] 6.6 Import and use Header in layout.tsx
  - [ ] 6.7 Add proper semantic HTML (header, main, nav)
  - [ ] 6.8 Test navigation links (create placeholder pages if needed)

- [x] **Task 7: Create home page** (AC: 9)
  - [ ] 7.1 Open `app/page.tsx`
  - [ ] 7.2 Import Card, Button from shadcn/ui
  - [ ] 7.3 Create hero section with "System Operational" message
  - [ ] 7.4 Add system status indicator using Badge (green for operational)
  - [ ] 7.5 Display environment info (development/production)
  - [ ] 7.6 Add placeholder sections for: Recent Jobs, Quick Stats
  - [ ] 7.7 Use Tailwind grid layout for responsive design
  - [ ] 7.8 Add "View Dashboard" Button linking to /dashboard

- [x] **Task 8: Configure environment variables** (AC: 12)
  - [ ] 8.1 Create `apps/web/.env.local` (if not exists)
  - [ ] 8.2 Add: `NEXT_PUBLIC_API_URL=` (PostgREST URL from Story 1.4)
  - [ ] 8.3 Add: `NEXT_PUBLIC_APP_ENV=development`
  - [ ] 8.4 Create `apps/web/.env.example` with placeholder values
  - [ ] 8.5 Update `.gitignore` to exclude `.env.local`
  - [ ] 8.6 Test env var access: Display `process.env.NEXT_PUBLIC_API_URL` on page
  - [ ] 8.7 Verify env vars load on server and client

- [x] **Task 9: Test and verify** (AC: 10, 11, 13)
  - [ ] 9.1 Run dev server: `npm run dev --workspace=apps/web`
  - [ ] 9.2 Verify server starts on http://localhost:3001
  - [ ] 9.3 Open browser and navigate to http://localhost:3001
  - [ ] 9.4 Verify home page renders correctly
  - [ ] 9.5 Test hot reload: Edit page.tsx, save, verify auto-refresh
  - [ ] 9.6 Test responsive design:
    - [ ] Desktop (1920px): Full layout with sidebar
    - [ ] Tablet (768px): Collapsed navigation
    - [ ] Mobile (375px): Mobile menu
  - [ ] 9.7 Test all shadcn components render correctly
  - [ ] 9.8 Check browser console for errors (should be none)
  - [ ] 9.9 Verify Tailwind styles apply (inspect element classes)

- [x] **Task 10: Update workspace scripts and documentation** (AC: 10)
  - [ ] 10.1 Update root `package.json` scripts:
    - [ ] `"dev": "npm run dev --workspace=apps/web"`
    - [ ] `"build": "npm run build --workspace=apps/web"`
    - [ ] `"start": "npm run start --workspace=apps/web"`
  - [ ] 10.2 Test root scripts work: `npm run dev` (from root)
  - [ ] 10.3 Update project README.md with Next.js setup instructions
  - [ ] 10.4 Document available routes and pages
  - [ ] 10.5 Add screenshots or describe UI structure

---

## Dev Notes

### Next.js 15 App Router

This story initializes Next.js 15 with the **App Router** (not Pages Router). The App Router is the modern approach for Next.js applications with these benefits:

**Key Features:**
- **Server Components by default**: Better performance, smaller bundles
- **Layouts**: Shared UI across routes
- **Loading & Error states**: Built-in UI patterns
- **Streaming**: Progressive rendering
- **Route Groups**: Organize routes without affecting URL structure

### Project Structure After Initialization

```
apps/web/
├── app/
│   ├── layout.tsx           # Root layout (wraps all pages)
│   ├── page.tsx             # Home page (/)
│   ├── globals.css          # Global styles + Tailwind
│   └── favicon.ico
├── components/
│   ├── ui/                  # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── badge.tsx
│   │   ├── separator.tsx
│   │   └── skeleton.tsx
│   └── layout/              # Layout components
│       └── header.tsx
├── lib/
│   └── utils.ts             # Utility functions (cn, etc.)
├── public/                  # Static assets
├── .env.local               # Local environment variables
├── .env.example             # Example env vars
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Package dependencies
```

### shadcn/ui Component System

shadcn/ui is **not a traditional component library**. Instead of installing packages, it copies component source code directly into your project.

**Benefits:**
- **Full control**: Own the code, customize freely
- **No package bloat**: Only install components you use
- **Tailwind-based**: Fully customizable with Tailwind
- **Accessible**: Built on Radix UI primitives
- **TypeScript**: Fully typed components

**Component Installation Pattern:**
```bash
npx shadcn@latest add button
# Creates: components/ui/button.tsx
```

### Root Layout Template

**`app/layout.tsx`:**

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Job Application System',
  description: 'Automated job search and application platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-background antialiased">
        <Header />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
```

### Header Component Template

**`components/layout/header.tsx`:**

```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            JobApp
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
              Dashboard
            </Link>
            <Link href="/jobs" className="text-sm font-medium hover:text-primary">
              Jobs
            </Link>
            <Link href="/projects" className="text-sm font-medium hover:text-primary">
              Projects
            </Link>
          </nav>
        </div>
        <Button variant="outline">Sign In</Button>
      </div>
    </header>
  )
}
```

### Home Page Template

**`app/page.tsx`:**

```tsx
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export default function HomePage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'Not configured'
  const environment = process.env.NEXT_PUBLIC_APP_ENV || 'unknown'

  return (
    <div className="flex flex-col gap-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <div className="flex justify-center mb-4">
          <Badge variant="default" className="bg-green-500">
            System Operational
          </Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">
          Job Application System
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          Automated job search and application platform
        </p>
        <Link href="/dashboard">
          <Button size="lg">View Dashboard</Button>
        </Link>
      </section>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Current environment configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <div className="flex justify-between">
              <span className="font-medium">Environment:</span>
              <Badge variant="outline">{environment}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">API URL:</span>
              <span className="text-sm text-muted-foreground truncate max-w-xs">
                {apiUrl}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Placeholder */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Jobs Scraped</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Applications Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

### Tailwind Configuration

**`tailwind.config.ts` (after shadcn init):**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... shadcn theme colors
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

### Environment Variables

**`.env.local` (for development):**

```bash
# PostgREST API (from Story 1.4)
NEXT_PUBLIC_API_URL=https://postgrest-xxx.railway.app

# Application environment
NEXT_PUBLIC_APP_ENV=development

# Future: Authentication (Story 5.4)
# NEXTAUTH_URL=http://localhost:3001
# NEXTAUTH_SECRET=your-secret-here
```

**`.env.example` (committed to git):**

```bash
# PostgREST API URL
NEXT_PUBLIC_API_URL=https://your-postgrest-url.railway.app

# Application environment
NEXT_PUBLIC_APP_ENV=development
```

### TypeScript Configuration

**Enable strict mode in `tsconfig.json`:**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,  // ← Enable strict mode
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Responsive Design Breakpoints

**Tailwind default breakpoints:**

```typescript
// Mobile-first approach
sm: '640px'    // Small devices (tablets)
md: '768px'    // Medium devices (laptops)
lg: '1024px'   // Large devices (desktops)
xl: '1280px'   // Extra large devices
2xl: '1536px'  // 2X large devices
```

**Testing responsive design:**

1. **Desktop (1920px)**: Full layout with sidebar
   ```tsx
   <div className="grid grid-cols-12 gap-4">
     <aside className="col-span-3">Sidebar</aside>
     <main className="col-span-9">Content</main>
   </div>
   ```

2. **Tablet (768px)**: Collapsed navigation
   ```tsx
   <nav className="hidden md:flex">Desktop Nav</nav>
   <button className="md:hidden">Mobile Menu</button>
   ```

3. **Mobile (375px)**: Stacked layout
   ```tsx
   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
   ```

### Development Workflow

**Starting the dev server:**

```bash
# From project root
npm run dev

# Or specifically
npm run dev --workspace=apps/web

# Or from apps/web directory
cd apps/web && npm run dev
```

**Hot Module Replacement (HMR):**
- Edit any file in `app/` or `components/`
- Save the file
- Browser automatically refreshes with changes
- No manual reload needed

### Common Issues & Solutions

**Issue: Port 3000 already in use**
```bash
# Next.js default port is 3000
# Change in package.json:
"dev": "next dev -p 3001"
```

**Issue: Tailwind styles not applying**
- Check `globals.css` has Tailwind directives
- Verify `tailwind.config.ts` content paths
- Restart dev server

**Issue: shadcn components not found**
- Run `npx shadcn@latest add [component]` again
- Check import path uses `@/components/ui/`
- Verify `tsconfig.json` has paths configured

**Issue: Environment variables not loaded**
- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Restart dev server after adding new env vars
- Check `.env.local` exists and is not gitignored at build time

### Performance Optimization

**Server Components (default):**
```tsx
// This is a Server Component by default
export default function Page() {
  return <div>Server-rendered</div>
}
```

**Client Components (when needed):**
```tsx
'use client'  // ← Add this directive at top

import { useState } from 'react'

export default function InteractiveComponent() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**Use Server Components when possible:**
- No JavaScript sent to client
- Can access backend directly
- Better performance

**Use Client Components only when:**
- Need React hooks (useState, useEffect)
- Need browser APIs (localStorage, window)
- Need event handlers (onClick, onChange)

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-23 | 1.0 | Story preparation with detailed task breakdown | Bob (Scrum Master) |

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

No blocking issues encountered.

### Completion Notes List

- Next.js 16 initialized with Next.js 16.0.0, React 19.2.0, TypeScript 5
- Downgraded Tailwind from v4 to v3.x for shadcn/ui compatibility
- All shadcn/ui components installed successfully (button, card, input, label, badge, separator, skeleton)
- Inter font configured for typography
- Development server runs on port 3001
- Home page displays "System Operational" with environment info
- Header navigation created with responsive design
- Environment variables configured (.env.local and .env.example)

### Change Log

- **2025-10-25**: Implemented all 10 tasks successfully. Modified Tailwind setup from v4 to v3 for shadcn compatibility.

### File List

**Expected Files to be Created:**
- `/apps/web/app/layout.tsx`
- `/apps/web/app/page.tsx`
- `/apps/web/app/globals.css`
- `/apps/web/components/layout/header.tsx`
- `/apps/web/components/ui/button.tsx`
- `/apps/web/components/ui/card.tsx`
- `/apps/web/components/ui/input.tsx`
- `/apps/web/components/ui/label.tsx`
- `/apps/web/components/ui/badge.tsx`
- `/apps/web/components/ui/separator.tsx`
- `/apps/web/components/ui/skeleton.tsx`
- `/apps/web/lib/utils.ts`
- `/apps/web/.env.local`
- `/apps/web/.env.example`
- `/apps/web/package.json`
- `/apps/web/tsconfig.json`
- `/apps/web/tailwind.config.ts`
- `/apps/web/next.config.js`

---

## QA Results

_To be filled by QA after implementation_
