# Story 1.5: Initialize NextJS Application

> **Epic**: Epic 1 - Foundation & Core Infrastructure
> **Status**: Not Started
> **Estimated Time**: 3-4 hours

---

## User Story

**As a** developer
**I want** NextJS 14+ app initialized with Tailwind and shadcn/ui
**So that** I can build the frontend interface

---

## Acceptance Criteria

- [ ] NextJS 14+ initialized in `/apps/web`
- [ ] TypeScript configured
- [ ] Tailwind CSS v3.x installed and configured
- [ ] shadcn/ui initialized with default theme
- [ ] Base components installed from shadcn/ui:
  - Button, Card, Input, Label, Badge, Separator
- [ ] Font configuration (Google Fonts via Next.js optimization)
- [ ] App router configured (`/app` directory)
- [ ] Basic layout created with navigation structure
- [ ] Home page (`/app/page.tsx`) created with "System Operational" placeholder
- [ ] Development server runs successfully (`npm run dev`)
- [ ] Hot reload verified working
- [ ] Environment variables loaded from `.env.local`
- [ ] Responsive design verified (desktop + tablet)

---

## Technical Notes

- Use Next.js App Router (not Pages Router)
- Configure Tailwind with shadcn/ui defaults
- Install Lucide React for icons

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] NextJS application running successfully
- [ ] All base UI components installed and working
- [ ] Development environment fully functional
- [ ] Responsive design verified across devices
