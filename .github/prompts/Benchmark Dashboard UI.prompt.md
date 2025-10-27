---
mode: agent
---
📝 Prompt 5: Benchmark Dashboard UI
File: C:\dev-projects\ai-ui\benchmark-dashboard.html

Create benchmark-dashboard.html - comprehensive benchmark visualization and comparison interface.

Requirements:
1. Multi-section dashboard:

   SECTION A: Score Overview (Top of page)
   - Large display of overall score (0-100)
   - Score gauge/meter visualization
   - Color-coded: Red (<60), Yellow (60-79), Green (80-100)
   - Industry rank badge
   - "Last benchmarked: X hours ago"
   - "Run New Benchmark" button
   
   SECTION B: Category Breakdown
   - Radar/spider chart showing all 5 categories
   - Bar chart comparing your scores to industry average
   - Each category clickable for detailed view
   - Visual indicators for strong/weak areas
   
   SECTION C: Industry Comparison
   - Horizontal bar chart comparing to all industry models
   - Your AI highlighted
   - Show gaps (points difference)
   - Leaderboard style layout:
     1. GPT-4: 92/100 (+24 vs you)
     2. Claude-3-Opus: 91/100 (+23 vs you)
     ...
     6. Your AI: 68/100
     7. Llama-3.1: 78/100 (-10 vs you)
   
   SECTION D: Historical Trends
   - Line chart showing score over time
   - Multiple lines for different categories
   - Show industry baselines (static lines)
   - Annotations for major improvements
   - "Your score over time vs GPT-3.5-turbo baseline"
   
   SECTION E: Detailed Metrics Table
   - Expandable table with all test results
   - Columns: Test Name, Score, Status, Benchmark, Gap
   - Sortable and filterable
   - Export as CSV option
   
   SECTION F: Strengths & Weaknesses
   - Two columns side-by-side
   - Strengths (green):
     * "Speed: 85/100 (Faster than GPT-4)"
     * "Memory Efficiency: 90/100"
   - Weaknesses (red):
     * "Knowledge: 65/100 (25 points below Claude)"
     * "Reasoning: 60/100"
   - Actionable suggestions for improvements
   
   SECTION G: Improvement Suggestions
   - AI-generated recommendations
   - Priority ranked (High/Medium/Low)
   - Expected impact: "+5 points if you..."
   - Link to relevant Phase/Prompt
   
   SECTION H: Milestones & Achievements
   - Timeline of achievements
   - "Broke 70/100 for first time"
   - "Surpassed Llama-3.1 baseline"
   - "10 weeks consecutive improvement"

2. Interactive features:

   - Click category → Deep dive into that category
   - Click model → Compare directly to that model
   - Click trend line → See what changed that week
   - Hover over chart → Tooltip with details
   - Date range selector for historical view

3. Benchmark runner:

   - "Run Benchmark" modal
   - Select categories (checkboxes)
   - Quick mode toggle
   - Progress bar during execution
   - Estimated time remaining
   - Real-time status updates

4. Comparison mode:

   - Toggle "Compare to:" dropdown
   - Options: GPT-4, Claude-3-Opus, GPT-3.5-turbo, etc.
   - Overlay comparison on charts
   - Highlight differences

5. Export options:

   - Export report as PDF
   - Export data as JSON
   - Export charts as PNG
   - Share link (if deployed online)

6. Responsive design:

   - Desktop: Multi-column layout
   - Tablet: Stack sections
   - Mobile: Simplified view

7. Chart libraries:

   - Use Chart.js for most charts
   - Use Plotly for radar chart
   - Smooth animations
   - Dark theme consistent with other pages

8. Real-time updates:

   - WebSocket or polling for live benchmark progress
   - Auto-refresh when new benchmark completes
   - Notification when score improves/declines

Styling: Professional data visualization design. Make it look like a SaaS product dashboard (think Datadog, New Relic style). Use modern UI with cards, shadows, gradients. Dark theme by default with light theme toggle.