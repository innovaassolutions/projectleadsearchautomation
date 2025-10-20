# Epic 4: AI-Powered Application Customization

> **Phase**: 1 (MVP)
> **Estimated Time**: 3-4 weeks
> **Must Complete Before**: Epic 5 (Application Submission & Tracking)
> **Depends On**: Epic 3 (Application Project Management & Matching)
> **Status**: Not Started
> **Stories**: 10

---

## Overview

Implement comprehensive template management system for resumes and cover letters, build OpenAI-powered customization engine that generates tailored application materials for each job, create A/B testing framework to compare different resume versions, implement quality control workflows with automated scoring, build template editor UI with preview capabilities, establish version history and rollback functionality, create template library for importing proven templates, and implement bulk testing workflow for quality assurance.

**Why This Matters**: AI-powered customization is the core value proposition that enables high-volume, high-quality applications. Without intelligent resume and cover letter generation, users would need to manually customize each application, defeating the purpose of automation. The A/B testing and quality scoring ensure generated materials maintain professional standards at scale.

---

## Epic Goal

Deploy a complete AI-powered application customization system that allows users to manage master resume and cover letter templates, automatically generate job-specific customized versions using OpenAI GPT-4o, test different resume strategies with A/B testing, ensure quality through automated scoring, preview and regenerate materials before submission, and track version history—all while maintaining professional quality standards across hundreds of applications.

---

## User Stories

### Story 4.1: Resume Template Management System

**As a** user
**I want** to create and manage master resume templates
**So that** I can maintain different resume versions for different job types

**Acceptance Criteria**:
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

**Technical Notes**:
- Use Tiptap or similar rich text editor
- Store content as structured JSON (not HTML)
- Support variables for dynamic content: `{{company}}`, `{{position}}`
- Consider PDF generation for preview (future enhancement)

**Estimated Time**: 10-12 hours

---

### Story 4.2: Cover Letter Template Management

**As a** user
**I want** to create and manage cover letter templates
**So that** I can maintain different cover letter styles for different opportunities

**Acceptance Criteria**:
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

**Technical Notes**:
- Store templates as structured JSON with sections
- Support variable placeholders for AI-generated content
- Consider tone analysis for quality control
- Limit cover letter length to prevent overly long letters

**Estimated Time**: 8-10 hours

---

### Story 4.3: OpenAI Resume Customization Engine

**As a** system
**I want** to generate customized resumes for each job using OpenAI
**So that** application materials are tailored to specific opportunities

**Acceptance Criteria**:
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

**Technical Notes**:
- Use OpenAI function calling for structured output
- Implement strict validation to prevent hallucinations
- Consider caching similar job customizations
- Monitor costs closely (target <$0.05 per resume)
- Use few-shot examples in prompt for better quality

**Estimated Time**: 12-14 hours

---

### Story 4.4: OpenAI Cover Letter Customization Engine

**As a** system
**I want** to generate customized cover letters for each job using OpenAI
**So that** cover letters are personalized and compelling

**Acceptance Criteria**:
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

**Technical Notes**:
- Use separate workflow from resume (different prompts/models)
- Consider company research enrichment (website scraping)
- Implement tone detection and adjustment
- Monitor hallucinations carefully (no fake achievements)
- Use few-shot examples for different company types

**Estimated Time**: 10-12 hours

---

### Story 4.5: Preview and Regeneration UI

**As a** user
**I want** to preview customized resumes and cover letters before submission
**So that** I can review quality and regenerate if needed

**Acceptance Criteria**:
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

**Technical Notes**:
- Use diff library for change visualization (e.g., react-diff-viewer)
- Implement real-time preview updates
- Store regeneration history (versions table)
- Consider PDF generation for final preview
- Cache regeneration options to avoid duplicate API calls

**Estimated Time**: 12-14 hours

---

### Story 4.6: A/B Testing Framework for Resume Versions

**As a** user
**I want** to test different resume versions with A/B testing
**So that** I can identify which approaches yield better interview rates

**Acceptance Criteria**:
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

**Technical Notes**:
- Use PostgreSQL random() function for variant assignment
- Implement statistical testing (chi-squared, t-test)
- Consider time-based analysis (early vs. late applications)
- Store raw test data for future analysis
- Ensure sufficient sample size before declaring winner

**Estimated Time**: 12-14 hours

---

### Story 4.7: Quality Scoring System for Generated Materials

**As a** system
**I want** to automatically score the quality of generated resumes and cover letters
**So that** low-quality materials are flagged for review before submission

**Acceptance Criteria**:
- [ ] Quality scoring algorithm implemented as API endpoint: `POST /api/quality-score`
- [ ] Resume quality scoring (0-100):
  - **Relevance (30 points)**: Skills/experience match job requirements
  - **Completeness (20 points)**: All sections present, no missing info
  - **Keyword density (15 points)**: Job-specific keywords naturally included
  - **Quantification (15 points)**: Achievements include numbers/metrics
  - **Formatting (10 points)**: Consistent structure, proper grammar
  - **Length (10 points)**: Appropriate length (1-2 pages, 400-800 words)
- [ ] Cover letter quality scoring (0-100):
  - **Personalization (30 points)**: Company/role specifically mentioned
  - **Relevance (25 points)**: Qualifications match job requirements
  - **Tone (15 points)**: Appropriate tone for company culture
  - **Length (15 points)**: 250-400 words ideal
  - **Structure (10 points)**: Clear opening, body, closing
  - **Grammar (5 points)**: No obvious errors
- [ ] Scoring implementation:
  - Use NLP library (spaCy or similar) for text analysis
  - Keyword matching against job description
  - Grammar checking (LanguageTool API or similar)
  - Custom rules for each dimension
- [ ] Quality score stored in `applications` table:
  - Columns: `resume_quality_score`, `cover_letter_quality_score`
- [ ] Integration with customization workflows:
  - Score calculated immediately after AI generation
  - If score < 70, flag for manual review
  - If score < 50, automatically regenerate once
- [ ] Quality dashboard UI (`/app/quality/page.tsx`):
  - Average scores by project
  - Score distribution histogram
  - Low-quality applications list (score < 70)
  - "Review and Improve" action for flagged applications
- [ ] Scoring criteria configurable per user:
  - Adjust weight of each dimension
  - Set custom thresholds
- [ ] Scoring history tracked for continuous improvement

**Technical Notes**:
- Use combination of rule-based and ML-based scoring
- Consider using OpenAI for quality assessment (meta-evaluation)
- Benchmark against human-reviewed applications
- Tune scoring weights based on interview success rates
- Store detailed scoring breakdown (not just total score)

**Estimated Time**: 14-16 hours

---

### Story 4.8: Template Library and Import System

**As a** user
**I want** to browse and import proven resume/cover letter templates
**So that** I can leverage successful templates without starting from scratch

**Acceptance Criteria**:
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

**Technical Notes**:
- Store library templates in separate table or flag (`is_library_template`)
- Use same schema as user templates
- Validate imported JSON structure rigorously
- Consider template versioning for updates
- Sanitize user-uploaded templates (prevent XSS)

**Estimated Time**: 10-12 hours

---

### Story 4.9: Version History and Rollback

**As a** user
**I want** to see version history of customized materials and rollback if needed
**So that** I can track changes and recover previous versions

**Acceptance Criteria**:
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

**Technical Notes**:
- Use trigger or application logic to create versions
- Implement diff algorithm for change detection
- Store full copies (not diffs) for reliability
- Consider compression for storage efficiency
- Index on application_id and version_number

**Estimated Time**: 10-12 hours

---

### Story 4.10: Bulk Testing and Quality Assurance Workflow

**As a** user
**I want** to test resume/cover letter generation on multiple jobs at once
**So that** I can validate quality before enabling automation

**Acceptance Criteria**:
- [ ] Bulk testing page created: `/app/templates/test/page.tsx`
- [ ] Test configuration form:
  - Select resume template to test
  - Select cover letter template to test
  - Select test job set:
    - Option 1: Random sample (size: 5, 10, 20)
    - Option 2: Specific jobs (multi-select from job list)
    - Option 3: Jobs from specific project
  - Enable/disable quality scoring
  - Run A/B test variants (optional)
- [ ] "Start Test" button triggers workflow:
  - Creates test batch record in database
  - Queues customization jobs for each test job
  - Shows progress indicator
- [ ] Database migration: `010_bulk_tests.sql`
- [ ] Table created: `bulk_test_batches`
  - Columns: `id`, `user_id`, `resume_template_id`, `cover_letter_template_id`, `test_job_count`, `status`, `started_at`, `completed_at`
- [ ] Table created: `bulk_test_results`
  - Columns: `id`, `batch_id`, `job_id`, `customized_resume_json`, `customized_cover_letter_text`, `resume_quality_score`, `cover_letter_quality_score`, `generation_time_ms`, `tokens_used`, `cost_usd`
- [ ] Test execution:
  - Process jobs in parallel (5 concurrent max)
  - Generate customized resume and cover letter for each
  - Calculate quality scores
  - Track generation time and cost
  - Store results in `bulk_test_results`
- [ ] Results dashboard:
  - Test summary:
    - Jobs tested
    - Average quality scores (resume and cover letter)
    - Total cost ($X.XX)
    - Total time (X minutes)
  - Results table:
    - Job title, company
    - Quality scores (color-coded)
    - "View Details" link → preview generated materials
  - Filtering: show only low-quality (score < 70)
  - Export results as CSV
- [ ] Test actions:
  - "Approve Template" - mark template as production-ready
  - "Revise Template" - identify issues and return to editor
  - "Run Again" - retry with different parameters
- [ ] Cost projection before test:
  - Estimate cost based on job count
  - Show confirmation: "This test will cost approximately $X.XX"

**Technical Notes**:
- Use n8n workflow or API endpoint for batch processing
- Implement rate limiting for OpenAI API
- Use database queue for job processing
- Calculate cost based on tokens used
- Consider caching to reduce redundant API calls
- Store test results for historical analysis

**Estimated Time**: 12-14 hours

---

## Epic Summary

**Total Stories**: 10
**Total Estimated Time**: 3-4 weeks (developer time)
**Blocking**: Yes - Must complete before Epic 5

**Completion Checklist**:
- [ ] Story 4.1: Resume template management system
- [ ] Story 4.2: Cover letter template management
- [ ] Story 4.3: OpenAI resume customization engine
- [ ] Story 4.4: OpenAI cover letter customization engine
- [ ] Story 4.5: Preview and regeneration UI
- [ ] Story 4.6: A/B testing framework
- [ ] Story 4.7: Quality scoring system
- [ ] Story 4.8: Template library and import
- [ ] Story 4.9: Version history and rollback
- [ ] Story 4.10: Bulk testing workflow

**Ready to Proceed When**:
- All 10 stories completed
- Users can create and manage templates
- AI customization generates high-quality materials (>80 quality score)
- Preview UI allows review and regeneration
- A/B testing identifies successful strategies
- Quality scoring flags low-quality materials
- Template library provides starting points
- Version history enables rollback
- Bulk testing validates templates before production

---

## Definition of Done

This epic is complete when:

1. **Template Management Works**: Users can create, edit, and manage resume and cover letter templates
2. **AI Customization Deployed**: OpenAI generates job-specific customized materials with >80 quality score
3. **Preview UI Functional**: Users can preview, compare, and regenerate materials before submission
4. **A/B Testing Active**: Framework enables testing different resume strategies
5. **Quality Assured**: Automated scoring flags low-quality materials (<70 score) for review
6. **Template Library Live**: Users can import proven templates from curated library
7. **Version Control**: History tracking enables rollback to previous versions
8. **Bulk Testing**: Users can validate templates on multiple jobs before production use
9. **Cost Efficient**: Customization costs remain <$0.10 per application
10. **Success Validated**: A/B testing shows optimal resume strategies

---

## Technical Dependencies

**Epic 3 Completion**:
- Application projects with matched jobs available
- Matching engine providing job candidates for customization

**Database Schema**:
- `resume_templates` table
- `cover_letter_templates` table
- `resume_ab_tests` table
- `customization_versions` table
- `bulk_test_batches` and `bulk_test_results` tables
- Additional columns in `applications` table

**External Services**:
- OpenAI API (GPT-4o for customization)
- Grammar checking API (optional, for quality scoring)

**Infrastructure**:
- n8n workflows for batch processing
- Sufficient OpenAI API rate limits
- Storage for version history

---

## Risk Mitigation

**Risk**: OpenAI API costs exceed budget ($0.10 per application)
- **Mitigation**: Use GPT-4o-mini for initial drafts, GPT-4o only for final version; implement caching
- **Fallback**: Use template with variable substitution; manual customization

**Risk**: AI generates fabricated content (hallucinations)
- **Mitigation**: Strict validation; compare generated content against original template; user review required
- **Fallback**: Flag suspicious content; require manual review for low-quality scores

**Risk**: Generated materials are generic or low-quality
- **Mitigation**: Implement quality scoring; use few-shot prompting; A/B test different approaches
- **Fallback**: Regenerate with different parameters; allow manual editing

**Risk**: Users don't review generated materials (over-trust automation)
- **Mitigation**: Default to Semi Auto mode requiring review; show quality scores prominently
- **Fallback**: Force preview step before submission; periodic quality audits

**Risk**: A/B testing doesn't reach statistical significance (insufficient sample size)
- **Mitigation**: Require minimum 20 applications per variant; show confidence intervals
- **Fallback**: Use qualitative review; disable A/B testing if sample size insufficient

---

## Success Metrics

- ✅ Resume customization quality score: >80 average
- ✅ Cover letter customization quality score: >75 average
- ✅ Customization cost: <$0.10 per application (resume + cover letter)
- ✅ User satisfaction: >70% of customizations approved without regeneration
- ✅ A/B testing: Identify winning variant with >10% improvement in interview rate
- ✅ Quality flagging: <5% false positives (high-quality materials flagged as low-quality)
- ✅ Template library usage: >50% of users import at least one template
- ✅ Bulk testing adoption: >30% of users run bulk tests before production

---

## Next Steps

After completing Epic 4, proceed to **Epic 5: Application Submission & Tracking** where you will:
- Build review queue UI for Semi Auto mode
- Implement full auto submission workflows
- Create form automation for application submissions
- Build comprehensive application tracking dashboard
- Implement status workflow automation
- Create application detail pages
- Establish duplicate prevention mechanisms
- Build analytics for application performance
- Enable manual application entry

Epic 5 will use the customized application materials from Epic 4 to submit applications and track their progress through the hiring pipeline.
