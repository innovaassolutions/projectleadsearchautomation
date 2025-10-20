# Story 5.4: User Profile Management

**Epic**: 5 - Application Submission & Tracking
**Story ID**: 5.4
**Estimated Time**: 8-10 hours

---

## User Story

**As a** user
**I want** to manage my profile information used for application forms
**So that** automated submissions have accurate personal data

---

## Acceptance Criteria

- [ ] NextJS page created: `/app/profile/page.tsx`
- [ ] Profile form displays all fields:
  - **Personal Information**:
    - Full name (required)
    - Email (required, validated)
    - Phone number (required, formatted)
    - Location (city, state/country)
  - **Professional Information**:
    - Current job title
    - Years of experience (slider: 0-30+)
    - Current employment status (employed, unemployed, open to offers)
    - LinkedIn URL
    - Portfolio website URL
    - GitHub URL (optional)
  - **Application Preferences**:
    - Work authorization (dropdown by country)
    - Visa sponsorship required (yes/no)
    - Willing to relocate (yes/no)
    - Remote work preference (fully remote, hybrid OK, any)
    - Salary expectations (range with currency)
    - Availability (immediate, 2 weeks, 1 month, negotiable)
  - **Diversity & Inclusion** (optional):
    - Gender (optional, for DEI programs)
    - Veteran status (yes/no/decline)
    - Disability status (yes/no/decline)
- [ ] Form validation:
  - Required fields enforced
  - Email format validation
  - Phone number formatting (international support)
  - URL validation for LinkedIn, portfolio, GitHub
- [ ] Save action:
  - API call: `PATCH /user_profiles?user_id=eq.{user_id}`
  - Optimistic UI update
  - Success toast: "Profile updated successfully"
  - Error handling with clear messages
- [ ] Profile completion indicator:
  - Progress bar showing % complete
  - Highlight missing required fields
  - Encourage 100% completion for best automation
- [ ] Resume file upload (optional):
  - Upload PDF resume (max 2MB)
  - Store in Supabase Storage or Railway volumes
  - Use as fallback if customization fails
  - Preview uploaded resume
- [ ] "Test Autofill" button:
  - Shows sample form with fields auto-filled
  - Validates profile data is complete
  - Identifies missing fields
- [ ] Data privacy notice:
  - Explain how data is used (application forms only)
  - No data shared with third parties
  - User can delete profile anytime
- [ ] Responsive design (desktop + tablet)

---

## Technical Notes

- Store profile as JSONB for flexibility
- Use libphonenumber for international phone formatting
- Implement field-level validation (client + server)
- Consider profile templates by industry/role

---

## Dependencies

- Epic 1 completed (NextJS app with forms)
- Database migration for user_profiles table
- File storage configured for resume uploads

---

## Definition of Done

- [ ] Profile form captures all required data
- [ ] Validation prevents invalid submissions
- [ ] Profile data stored correctly
- [ ] Completion indicator guides users
- [ ] Test autofill validates profile completeness
