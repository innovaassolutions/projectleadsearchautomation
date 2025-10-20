# Story 4.4: OpenAI Cover Letter Customization Engine

**Epic**: 4 - AI-Powered Application Customization
**Story ID**: 4.4
**Estimated Time**: 10-12 hours

---

## User Story

**As a** system
**I want** to generate customized cover letters for each job using OpenAI
**So that** cover letters are personalized and compelling

---

## Acceptance Criteria

- [ ] n8n workflow created: "OpenAI Cover Letter Customization"
- [ ] Workflow triggered after resume customization completes
- [ ] Workflow inputs:
  - Job description and company info
  - User's cover letter template (default or project-specific)
  - Customized resume (for consistency)
  - Company research data (if available)
- [ ] OpenAI API call configured:
  - Model: `gpt-4o` (high quality)
  - System prompt: "You are an expert cover letter writer..."
  - User prompt: job description + template + company info
  - Temperature: 0.5 (more creative than resume)
  - Max tokens: 800
- [ ] Customization instructions:
  - Write compelling opening that mentions specific company/role
  - Highlight 2-3 most relevant qualifications from resume
  - Demonstrate knowledge of company (use job description)
  - Express genuine enthusiasm for role and mission
  - Include clear call to action
  - Match tone to company culture (startup vs. enterprise)
  - Keep to 250-400 words
- [ ] OpenAI response parsed and validated:
  - Check word count (250-400 target)
  - Ensure company name mentioned correctly
  - Verify no fabricated claims
  - Check tone appropriateness
- [ ] Customized cover letter stored in `applications` table:
  - Column: `customized_cover_letter_text` (TEXT)
- [ ] Fallback: use template with variable substitution if API fails
- [ ] Cost tracking: log tokens used
- [ ] Quality scoring: rate on multiple dimensions
- [ ] Test with 10 sample jobs, verify quality
- [ ] Workflow exported to `/apps/n8n-workflows/cover-letter-customization.json`

---

## Technical Notes

- Use separate workflow from resume (different prompts/models)
- Consider company research enrichment (website scraping)
- Implement tone detection and adjustment
- Monitor hallucinations carefully (no fake achievements)
- Use few-shot examples for different company types

---

## Dependencies

- Story 4.2 completed (cover letter templates)
- Story 4.3 completed (resume customization as reference)
- OpenAI API key configured
- n8n workflows operational

---

## Definition of Done

- [ ] Workflow generates personalized cover letters
- [ ] Letters are compelling and appropriate tone
- [ ] Company/role mentioned specifically
- [ ] Word count within target range (250-400)
- [ ] Cost per cover letter <$0.05
