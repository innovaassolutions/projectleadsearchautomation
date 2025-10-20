# Story 4.7: Quality Scoring System for Generated Materials

**Epic**: 4 - AI-Powered Application Customization
**Story ID**: 4.7
**Estimated Time**: 14-16 hours

---

## User Story

**As a** system
**I want** to automatically score the quality of generated resumes and cover letters
**So that** low-quality materials are flagged for review before submission

---

## Acceptance Criteria

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

---

## Technical Notes

- Use combination of rule-based and ML-based scoring
- Consider using OpenAI for quality assessment (meta-evaluation)
- Benchmark against human-reviewed applications
- Tune scoring weights based on interview success rates
- Store detailed scoring breakdown (not just total score)

---

## Dependencies

- Story 4.3 and 4.4 completed (customization engines)
- NLP library installed (spaCy or similar)
- Grammar checking API integrated (optional)
- Database columns for quality scores added

---

## Definition of Done

- [ ] Scoring algorithm evaluates all quality dimensions
- [ ] Scores stored in database correctly
- [ ] Low-quality materials flagged automatically
- [ ] Quality dashboard displays scores and trends
- [ ] Scoring accuracy validated against human review
