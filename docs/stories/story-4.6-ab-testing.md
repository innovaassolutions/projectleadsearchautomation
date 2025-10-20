# Story 4.6: A/B Testing Framework for Resume Versions

**Epic**: 4 - AI-Powered Application Customization
**Story ID**: 4.6
**Estimated Time**: 12-14 hours

---

## User Story

**As a** user
**I want** to test different resume versions with A/B testing
**So that** I can identify which approaches yield better interview rates

---

## Acceptance Criteria

- [ ] A/B test configuration added to application projects
- [ ] Test configuration UI (`/app/projects/[id]/ab-testing/page.tsx`):
  - Enable A/B testing toggle
  - Define test variants (2-4 versions):
    - Variant A: "Technical-focused" (emphasize technical skills)
    - Variant B: "Leadership-focused" (emphasize management/leadership)
    - Variant C: "Growth-focused" (emphasize learning and adaptability)
    - Custom variants with instructions
  - Set distribution: 50/50, 33/33/33, etc.
  - Success metric: Interview requests per variant
- [ ] Database migration: `008_ab_testing.sql`
- [ ] Table created: `resume_ab_tests`
  - Columns: `id`, `project_id`, `variant_name`, `customization_instructions`, `distribution_percent`, `applications_count`, `interview_count`, `created_at`
- [ ] Workflow integration:
  - Resume customization workflow checks if A/B testing enabled
  - Randomly assigns variant based on distribution percentages
  - Applies variant-specific customization instructions to OpenAI prompt
  - Stores variant used in `applications.ab_test_variant` column
- [ ] Results dashboard section:
  - Table showing variants with metrics:
    - Variant name
    - Applications sent
    - Interview requests received
    - Conversion rate (% interviews)
    - Statistical significance indicator
  - Charts: conversion rate by variant over time
  - "Declare Winner" button (applies best variant to all future applications)
- [ ] Statistical significance calculation:
  - Minimum sample size: 20 applications per variant
  - Use chi-squared test for significance (p < 0.05)
  - Show confidence intervals
- [ ] "Declare Winner" action:
  - Disables A/B testing
  - Sets winning variant as default customization
  - Archives test results
- [ ] Test history: track completed A/B tests with results

---

## Technical Notes

- Use PostgreSQL random() function for variant assignment
- Implement statistical testing (chi-squared, t-test)
- Consider time-based analysis (early vs. late applications)
- Store raw test data for future analysis
- Ensure sufficient sample size before declaring winner

---

## Dependencies

- Story 4.3 completed (resume customization)
- Epic 3 completed (application projects)
- Database migration system ready
- Statistical analysis library (or manual implementation)

---

## Definition of Done

- [ ] Users can configure A/B tests for projects
- [ ] Variants randomly assigned based on distribution
- [ ] Results dashboard shows conversion rates
- [ ] Statistical significance calculated correctly
- [ ] Winning variant can be declared and applied
