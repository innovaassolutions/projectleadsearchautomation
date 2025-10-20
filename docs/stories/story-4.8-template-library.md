# Story 4.8: Template Library and Import System

**Epic**: 4 - AI-Powered Application Customization
**Story ID**: 4.8
**Estimated Time**: 10-12 hours

---

## User Story

**As a** user
**I want** to browse and import proven resume/cover letter templates
**So that** I can leverage successful templates without starting from scratch

---

## Acceptance Criteria

- [ ] Template library page created: `/app/templates/library/page.tsx`
- [ ] Library displays curated templates:
  - Categories: Software Engineer, Manager, Executive, Designer, etc.
  - Each template card shows:
    - Template name and preview thumbnail
    - Category/role
    - Success metrics (if available): "Used in 250 applications, 18% interview rate"
    - Rating (if available)
    - "Preview" and "Import" buttons
- [ ] Template preview modal:
  - Full template preview
  - Sections breakdown
  - Variable placeholders highlighted
  - "Import This Template" button
- [ ] Import action:
  - Copies template to user's templates
  - Opens template editor for customization
  - Success toast: "Template imported successfully"
- [ ] Database seeding: populate library with 10-15 starter templates
- [ ] Template source options:
  - Built-in curated templates (seeded in database)
  - Community templates (optional, future enhancement)
  - Export/import from file (JSON format)
- [ ] Export template functionality:
  - "Export" button on user templates
  - Downloads JSON file with template structure
  - Can be shared with other users
- [ ] Import from file:
  - "Import from File" button
  - File upload accepts .json
  - Validates structure before importing
  - Adds to user's templates
- [ ] Search and filtering:
  - Search templates by keyword
  - Filter by category/role
  - Sort by: Most popular, Highest rated, Newest
- [ ] Template ratings (optional):
  - Users can rate imported templates (1-5 stars)
  - Ratings visible in library

---

## Technical Notes

- Store library templates in separate table or flag (`is_library_template`)
- Use same schema as user templates
- Validate imported JSON structure rigorously
- Consider template versioning for updates
- Sanitize user-uploaded templates (prevent XSS)

---

## Dependencies

- Story 4.1 and 4.2 completed (template systems)
- Database seeding scripts ready
- File upload functionality configured

---

## Definition of Done

- [ ] Library page displays curated templates
- [ ] Users can preview templates before importing
- [ ] Import adds template to user's collection
- [ ] Export/import from file works correctly
- [ ] Search and filtering functional
- [ ] 10-15 starter templates seeded in database
