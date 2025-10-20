# Story 3.9: Project Templates and Duplication

**Epic**: 3 - Application Project Management & Matching
**Story ID**: 3.9
**Estimated Time**: 8-10 hours

---

## User Story

**As a** user
**I want** to save projects as templates and duplicate existing projects
**So that** I can quickly create similar projects with pre-configured criteria

---

## Acceptance Criteria

- [ ] "Save as Template" button added to project detail page
- [ ] Save template action:
  - Opens modal: "Template Name" input
  - Saves project criteria to `project_templates` table:
    - Columns: `id`, `user_id`, `name`, `description`, `criteria_json`, `created_at`
  - Success toast: "Template saved"
- [ ] "Use Template" button on project creation page
- [ ] Template selection modal:
  - List of user's saved templates
  - Each shows: name, description, created date
  - "Use This Template" button
- [ ] Using template pre-fills project creation form with criteria
- [ ] User can modify criteria before saving
- [ ] "Duplicate Project" action in project list:
  - Opens creation form pre-filled with all project data
  - Appends " (Copy)" to project name
  - Creates new project with same criteria
- [ ] Database migration: `004_project_templates.sql`
- [ ] PostgREST endpoints:
  - `GET /project_templates?user_id=eq.{user_id}`
  - `POST /project_templates`
  - `DELETE /project_templates?id=eq.{id}`
- [ ] Template count limit: 10 per user (prevent abuse)
- [ ] Validation: template names must be unique per user

---

## Technical Notes

- Store templates per-user (multi-user support in future)
- Consider sharing templates between users (public template library)
- Use same criteria validation as projects
- Templates are read-only references (editing template doesn't affect projects)

---

## Dependencies

- Story 3.1 completed (project CRUD)
- Story 3.2 completed (criteria configuration)
- Database migration system ready

---

## Definition of Done

- [ ] Users can save projects as templates
- [ ] Templates can be used to create new projects
- [ ] Duplicate action creates copy of existing project
- [ ] Template limit enforced
- [ ] Validation prevents duplicate template names
