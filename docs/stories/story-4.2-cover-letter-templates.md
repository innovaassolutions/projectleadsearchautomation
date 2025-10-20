# Story 4.2: Cover Letter Template Management

**Epic**: 4 - AI-Powered Application Customization
**Story ID**: 4.2
**Estimated Time**: 8-10 hours

---

## User Story

**As a** user
**I want** to create and manage cover letter templates
**So that** I can maintain different cover letter styles for different opportunities

---

## Acceptance Criteria

- [ ] NextJS page created: `/app/templates/cover-letters/page.tsx`
- [ ] Cover letter template list similar to resume templates
- [ ] Template creation form (`/app/templates/cover-letters/new/page.tsx`):
  - Name (required, max 100 chars)
  - Template style (dropdown: Professional, Enthusiastic, Technical, Executive)
  - Content sections:
    - Opening paragraph (why you're writing)
    - Body paragraphs (2-3, your qualifications)
    - Closing paragraph (call to action)
    - Signature
- [ ] Database migration: `007_cover_letter_templates.sql`
- [ ] Table created: `cover_letter_templates`
  - Columns: `id`, `user_id`, `name`, `style`, `content_json`, `is_default`, `usage_count`, `created_at`, `updated_at`
- [ ] Rich text editor with variable support:
  - `{{company}}`, `{{position}}`, `{{hiring_manager}}`
  - `{{my_experience}}`, `{{relevant_skills}}`
  - `{{company_product}}`, `{{company_mission}}`
- [ ] Preview modal with variable substitution
- [ ] Same CRUD operations as resume templates
- [ ] Character count indicator (target: 250-400 words)
- [ ] Tone selector: Professional, Friendly, Enthusiastic
- [ ] Template suggestions based on job type
- [ ] Responsive design (desktop + tablet)

---

## Technical Notes

- Store templates as structured JSON with sections
- Support variable placeholders for AI-generated content
- Consider tone analysis for quality control
- Limit cover letter length to prevent overly long letters

---

## Dependencies

- Story 4.1 completed (resume template system as reference)
- Database migration system ready
- Rich text editor configured

---

## Definition of Done

- [ ] Users can create cover letter templates
- [ ] Variable placeholders work correctly
- [ ] Character count helps users stay within limits
- [ ] CRUD operations functional
- [ ] Preview shows formatted cover letter
