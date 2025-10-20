# Story 4.9: Version History and Rollback

**Epic**: 4 - AI-Powered Application Customization
**Story ID**: 4.9
**Estimated Time**: 10-12 hours

---

## User Story

**As a** user
**I want** to see version history of customized materials and rollback if needed
**So that** I can track changes and recover previous versions

---

## Acceptance Criteria

- [ ] Database migration: `009_customization_versions.sql`
- [ ] Table created: `customization_versions`
  - Columns:
    - `id` (UUID, primary key)
    - `application_id` (UUID, foreign key)
    - `version_number` (integer, auto-increment per application)
    - `resume_json` (JSONB)
    - `cover_letter_text` (TEXT)
    - `generation_method` (enum: ai_generated, manually_edited, regenerated)
    - `resume_quality_score` (integer)
    - `cover_letter_quality_score` (integer)
    - `created_at` (timestamp)
    - `created_by` (enum: system, user)
- [ ] Version creation:
  - Automatically create version on initial AI generation
  - Create version on manual edit (if significant changes)
  - Create version on regeneration
  - Create version on rollback (copy of previous version)
- [ ] Version history UI on preview page:
  - "Version History" button opens side panel
  - List of versions with:
    - Version number (v1, v2, v3...)
    - Created timestamp (relative: "2 hours ago")
    - Method (AI Generated, Manually Edited, etc.)
    - Quality scores
    - "View" and "Restore" buttons
- [ ] View version action:
  - Loads version content into preview
  - Shows in read-only mode
  - Displays "Version X of Y" indicator
  - "Restore This Version" button available
- [ ] Restore version action:
  - Confirmation modal: "Restore to version X?"
  - Copies version content to current application
  - Creates new version entry (rollback record)
  - Updates application with restored content
  - Success toast: "Restored to version X"
- [ ] Version comparison:
  - "Compare" button for any two versions
  - Side-by-side diff view
  - Highlighted changes
- [ ] Version limit: keep max 10 versions per application
- [ ] Automatic cleanup: delete old versions after 90 days (configurable)

---

## Technical Notes

- Use trigger or application logic to create versions
- Implement diff algorithm for change detection
- Store full copies (not diffs) for reliability
- Consider compression for storage efficiency
- Index on application_id and version_number

---

## Dependencies

- Story 4.5 completed (preview UI)
- Database migration system ready
- Diff library available

---

## Definition of Done

- [ ] Versions automatically created on key events
- [ ] Version history UI displays all versions
- [ ] Users can view and restore previous versions
- [ ] Version comparison shows changes clearly
- [ ] Version limit enforced
- [ ] Old versions cleaned up automatically
