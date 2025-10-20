# Story 4.3: OpenAI Resume Customization Engine

**Epic**: 4 - AI-Powered Application Customization
**Story ID**: 4.3
**Estimated Time**: 12-14 hours

---

## User Story

**As a** system
**I want** to generate customized resumes for each job using OpenAI
**So that** application materials are tailored to specific opportunities

---

## Acceptance Criteria

- [ ] n8n workflow created: "OpenAI Resume Customization"
- [ ] Workflow triggered when application is queued (from matching engine)
- [ ] Workflow inputs:
  - Job description (title, company, description, required skills)
  - User's master resume template (default or project-specific)
  - Application project criteria (for context)
- [ ] OpenAI API call configured:
  - Model: `gpt-4o` (high quality for resume customization)
  - System prompt: "You are an expert resume writer..."
  - User prompt: job description + master resume + customization instructions
  - Temperature: 0.3 (consistent, less creative)
  - Max tokens: 2000
- [ ] Customization instructions:
  - Rewrite summary to align with job requirements
  - Reorder and emphasize relevant experience bullets
  - Highlight matching skills prominently
  - Add job-specific keywords naturally
  - Quantify achievements when possible
  - Keep formatting consistent with template
- [ ] OpenAI response parsed and structured:
  - Extract customized sections (summary, experience, skills)
  - Validate structure matches template
  - Check for hallucinations (verify all experience is from original)
- [ ] Customized resume stored in `applications` table:
  - Column: `customized_resume_json` (JSONB)
- [ ] Fallback: use master resume if API fails
- [ ] Cost tracking: log tokens used per customization
- [ ] Quality check: ensure no fabricated content
- [ ] Workflow logs customization statistics
- [ ] Test with 10 sample jobs, verify quality
- [ ] Workflow exported to `/apps/n8n-workflows/resume-customization.json`

---

## Technical Notes

- Use OpenAI function calling for structured output
- Implement strict validation to prevent hallucinations
- Consider caching similar job customizations
- Monitor costs closely (target <$0.05 per resume)
- Use few-shot examples in prompt for better quality

---

## Dependencies

- Story 4.1 completed (resume templates exist)
- Epic 3 completed (matched jobs available)
- OpenAI API key configured
- n8n workflow engine operational

---

## Definition of Done

- [ ] Workflow generates customized resumes for jobs
- [ ] Customizations are high-quality and relevant
- [ ] No hallucinated content in output
- [ ] Cost per resume <$0.05
- [ ] Fallback works when API fails
