# Story 5.9: Application Analytics Dashboard

**Epic**: 5 - Application Submission & Tracking
**Story ID**: 5.9
**Estimated Time**: 14-16 hours

---

## User Story

**As a** user
**I want** to view analytics and insights about my application performance
**So that** I can optimize my job search strategy and identify successful patterns

---

## Acceptance Criteria

- [ ] NextJS page created: `/app/analytics/page.tsx`
- [ ] Key metrics cards (top of page):
  - Total applications (all time)
  - Interview rate (% of applications → interview)
  - Average response time (days from application to first response)
  - Active applications (not in terminal status)
  - Success rate (% interviews → offers)
  - Current month applications
- [ ] Time-series chart: "Applications Over Time"
  - Line chart showing applications per day/week/month
  - Toggle: daily, weekly, monthly view
  - Color-coded by status (submitted, interview, rejected, offer)
  - Hover tooltips with exact counts
- [ ] Funnel visualization: "Application Funnel"
  - Stages: Matched → Submitted → Response → Interview → Offer
  - Show drop-off at each stage
  - Conversion rates between stages
  - Click to view applications in each stage
- [ ] Platform performance table:
  - Rows: Remote OK, WWR, Himalayas, YC Jobs, Wellfound, Other
  - Columns: Applications, Response Rate, Interview Rate
  - Sortable by any column
  - Highlight best-performing platform
- [ ] Industry/job type breakdown:
  - Pie chart: applications by industry
  - Pie chart: applications by job type (frontend, backend, etc.)
  - Stacked bar: success rate by category
- [ ] Top companies chart:
  - Bar chart: most applications sent to which companies
  - Color-coded by outcome (pending, interview, rejected)
  - Click to view all applications to that company
- [ ] Skills analysis:
  - Word cloud or tag cloud: most common skills in applied jobs
  - Success rate by skill (which skills lead to interviews)
  - Recommended skills to add (based on successful applications)
- [ ] Date range filter:
  - Dropdown: Last 7 days, Last 30 days, Last 3 months, All time
  - Custom date range picker
  - All charts/metrics update based on filter
- [ ] Project comparison:
  - If multiple projects: compare performance side-by-side
  - Metrics: applications, interview rate, time to response
  - Identify most successful project
- [ ] Export options:
  - "Export Report" button → PDF or CSV
  - Includes all charts and metrics
  - Timestamped for record-keeping
- [ ] Insights section:
  - Auto-generated insights:
    - "Your interview rate is 12%, above average (8%)"
    - "Most interviews from [platform]"
    - "Best response rate on [days of week]"
    - "[Skill] appears in 80% of your interviews"
- [ ] Responsive design (desktop focused, tablet support)

---

## Technical Notes

- Use Recharts for data visualization
- Implement efficient aggregation queries (PostgreSQL)
- Consider caching analytics data (refresh hourly)
- Use Server Components for initial data load
- Client Components for interactive filtering
- Store generated insights (don't recalculate every page load)

---

## Dependencies

- Story 5.5 completed (application tracking data)
- Recharts library installed
- Sufficient application data for meaningful analytics

---

## Definition of Done

- [ ] Analytics dashboard displays all charts and metrics
- [ ] Calculations accurate
- [ ] Filtering updates all visualizations
- [ ] Insights provide actionable recommendations
- [ ] Performance acceptable with 500+ applications
- [ ] Export functionality works
