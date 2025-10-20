# Story 4.5: Preview and Regeneration UI

**Epic**: 4 - AI-Powered Application Customization
**Story ID**: 4.5
**Estimated Time**: 12-14 hours

---

## User Story

**As a** user
**I want** to preview customized resumes and cover letters before submission
**So that** I can review quality and regenerate if needed

---

## Acceptance Criteria

- [ ] NextJS page created: `/app/applications/[id]/preview/page.tsx`
- [ ] Page displays side-by-side comparison:
  - Left: Original master template
  - Right: AI-customized version
- [ ] Resume preview shows:
  - Formatted resume with all sections
  - Highlighted changes (diff view toggle)
  - Word count per section
  - Skills mentioned vs. job requirements (match visualization)
- [ ] Cover letter preview shows:
  - Full formatted letter
  - Word count (target: 250-400)
  - Tone indicator (Professional, Enthusiastic, etc.)
  - Company mentions highlighted
- [ ] Action buttons:
  - "Approve" - accept customized version
  - "Regenerate" - call OpenAI API again with different parameters
  - "Edit Manually" - open editor with customized content
  - "Use Original" - skip customization, use master template
- [ ] Regenerate options modal:
  - Tone adjustment slider (more formal ↔ more casual)
  - Emphasis selector (technical skills, leadership, growth)
  - Custom instructions (text input)
  - "Generate Again" button
- [ ] Regenerate action:
  - Calls API endpoint: `POST /api/applications/{id}/regenerate`
  - Shows loading indicator
  - Updates preview with new version
  - Stores new version with timestamp
- [ ] Manual edit opens rich text editor:
  - Pre-filled with customized content
  - Save updates `customized_resume_json` or `customized_cover_letter_text`
- [ ] Change tracking: show what changed from master template
- [ ] Export options: PDF download, Copy to clipboard
- [ ] Responsive design (desktop focus, tablet support)

---

## Technical Notes

- Use diff library for change visualization (e.g., react-diff-viewer)
- Implement real-time preview updates
- Store regeneration history (versions table)
- Consider PDF generation for final preview
- Cache regeneration options to avoid duplicate API calls

---

## Dependencies

- Story 4.3 and 4.4 completed (customization engines)
- Database has customized materials stored
- Rich text editor configured
- Diff library installed

---

## Definition of Done

- [ ] Preview page displays customized materials
- [ ] Side-by-side comparison shows changes clearly
- [ ] Regenerate with custom parameters works
- [ ] Manual editing functional
- [ ] Export options available
- [ ] UI is intuitive and responsive
