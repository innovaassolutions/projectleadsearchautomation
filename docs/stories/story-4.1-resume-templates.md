# Story 4.1: Resume Template Management System

**Epic**: 4 - AI-Powered Application Customization
**Story ID**: 4.1
**Estimated Time**: 10-12 hours

---

## User Story

**As a** user
**I want** to create and manage master resume templates
**So that** I can maintain different resume versions for different job types

---

## Acceptance Criteria

- [ ] NextJS page created: `/app/templates/resumes/page.tsx`
- [ ] Resume template list displays all user templates with cards showing:
  - Template name
  - Template type badge (General, Technical, Manager, etc.)
  - Last updated date
  - Usage count (applications using this template)
  - "Set as Default" action
  - Quick actions: Edit, Duplicate, Delete, Preview
- [ ] "Create New Template" button navigates to template editor
- [ ] Template creation form (`/app/templates/resumes/new/page.tsx`):
  - Name (required, max 100 chars)
  - Type (dropdown: General, Technical, Manager, Executive, etc.)
  - Content sections (rich text editor):
    - Summary/Objective
    - Work Experience (multiple entries with company, title, dates, bullets)
    - Education (multiple entries)
    - Skills (categorized: languages, frameworks, tools, soft skills)
    - Projects (optional, multiple entries)
    - Certifications (optional)
    - Custom sections (optional)
- [ ] Database migration: `006_resume_templates.sql`
- [ ] Table created: `resume_templates`
  - Columns: `id`, `user_id`, `name`, `type`, `content_json`, `is_default`, `usage_count`, `created_at`, `updated_at`
- [ ] Rich text editor with formatting: bold, italic, lists, links
- [ ] Markdown support for content storage
- [ ] Form validation: required fields, character limits
- [ ] Create action calls: `POST /resume_templates`
- [ ] Edit form pre-populated with existing content
- [ ] Update action calls: `PATCH /resume_templates?id=eq.{id}`
- [ ] Delete action with confirmation (prevent if used in active projects)
- [ ] Preview modal shows formatted resume
- [ ] "Set as Default" action updates `is_default` flag
- [ ] Duplicate action creates copy with " (Copy)" suffix
- [ ] Empty state: "No templates yet" with CTA
- [ ] Responsive design (desktop + tablet)

---

## Technical Notes

- Use Tiptap or similar rich text editor
- Store content as structured JSON (not HTML)
- Support variables for dynamic content: `{{company}}`, `{{position}}`
- Consider PDF generation for preview (future enhancement)

---

## Dependencies

- Epic 1 completed (NextJS app with shadcn/ui)
- Database migration system ready
- Rich text editor library installed

---

## Definition of Done

- [ ] Users can create resume templates with all sections
- [ ] Templates stored correctly in database
- [ ] CRUD operations work for all templates
- [ ] Rich text editor supports formatting
- [ ] Preview shows formatted resume
- [ ] Validation prevents invalid templates
