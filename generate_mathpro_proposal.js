const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, Header, Footer,
  UnderlineType
} = require('docx');
const fs = require('fs');
const path = require('path');

// ─── COLORS ──────────────────────────────────────────────────────────────────
const C = {
  primary:    "1B4F8A",
  accent:     "2E86C1",
  starter:    "1A7A55",
  standard:   "1B4F8A",
  advanced:   "5B3FA6",
  lightGray:  "F4F6F8",
  midGray:    "D5DCE4",
  darkGray:   "4A4A4A",
  white:      "FFFFFF",
  black:      "1A1A1A",
  mutedText:  "666666",
  starterBg:  "E8F5EF",
  standardBg: "E8EFF8",
  advancedBg: "EDE8F8",
};

// ─── BORDER HELPERS ───────────────────────────────────────────────────────────
const noBorder  = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const allBorders = (color = C.midGray) => ({
  top:    { style: BorderStyle.SINGLE, size: 1, color },
  bottom: { style: BorderStyle.SINGLE, size: 1, color },
  left:   { style: BorderStyle.SINGLE, size: 1, color },
  right:  { style: BorderStyle.SINGLE, size: 1, color },
});

// ─── ELEMENT HELPERS ──────────────────────────────────────────────────────────
const sp = (before = 0, after = 0) => ({ spacing: { before, after } });

const cell = (children, opts = {}) => new TableCell({
  borders:       opts.borders ?? allBorders(),
  shading:       opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
  width:         opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
  margins:       { top: opts.mt ?? 100, bottom: opts.mb ?? 100, left: opts.ml ?? 140, right: opts.mr ?? 140 },
  verticalAlign: opts.vAlign ?? VerticalAlign.TOP,
  columnSpan:    opts.colSpan,
  children,
});

const para = (text, opts = {}) => new Paragraph({
  alignment: opts.align ?? AlignmentType.LEFT,
  ...sp(opts.before ?? 0, opts.after ?? 0),
  numbering: opts.ref ? { reference: opts.ref, level: opts.level ?? 0 } : undefined,
  children: [new TextRun({
    text,
    bold:      opts.bold    ?? false,
    italics:   opts.italic  ?? false,
    color:     opts.color   ?? C.black,
    size:      opts.size    ?? 22,
    font:      "Arial",
    underline: opts.underline ? { type: UnderlineType.SINGLE } : undefined,
  })],
});

const h1 = (text, color = C.primary) => new Paragraph({
  heading: HeadingLevel.HEADING_1, ...sp(300, 120),
  border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: C.accent, space: 4 } },
  children: [new TextRun({ text, bold: true, size: 36, color, font: "Arial" })],
});
const h2 = (text, color = C.accent) => new Paragraph({
  heading: HeadingLevel.HEADING_2, ...sp(240, 80),
  children: [new TextRun({ text, bold: true, size: 28, color, font: "Arial" })],
});
const h3 = (text, color = C.darkGray) => new Paragraph({
  heading: HeadingLevel.HEADING_3, ...sp(180, 60),
  children: [new TextRun({ text, bold: true, size: 24, color, font: "Arial" })],
});

const gap   = (b = 100, a = 100) => new Paragraph({ ...sp(b, a), children: [] });
const rule  = ()  => new Paragraph({
  ...sp(120, 120),
  border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.midGray, space: 1 } },
  children: [],
});

const bullet = (text, bold = false, color = C.black, size = 21) => new Paragraph({
  numbering: { reference: "bullets", level: 0 }, ...sp(40, 40),
  children: [new TextRun({ text, bold, color, size, font: "Arial" })],
});
const numbered = (text, ref = "steps") => new Paragraph({
  numbering: { reference: ref, level: 0 }, ...sp(60, 60),
  children: [new TextRun({ text, size: 22, font: "Arial" })],
});

// ─── TIER BANNER ─────────────────────────────────────────────────────────────
const tierBanner = (title, subtitle, hours, price, weeks, bg, fg) =>
  new Table({
    width: { size: 9746, type: WidthType.DXA }, columnWidths: [9746],
    borders: noBorders,
    rows: [
      new TableRow({ children: [cell([
        para(title,    { bold: true, size: 30, color: fg, after: 60 }),
        para(subtitle, { size: 20,  color: fg, after: 100 }),
      ], { fill: bg, borders: noBorders, ml: 220, mr: 220, mt: 180, mb: 60 })] }),
      new TableRow({ children: [cell([
        new Table({
          width: { size: 9306, type: WidthType.DXA }, columnWidths: [3102, 3102, 3102],
          borders: noBorders,
          rows: [new TableRow({ children: [
            cell([para("Estimated Dev Time", { bold: true, size: 18, color: fg }), para(hours, { size: 22, bold: true, color: fg })],
              { fill: bg, borders: noBorders, ml: 0, mr: 0, mt: 40, mb: 100 }),
            cell([para("Delivery Window",    { bold: true, size: 18, color: fg }), para(weeks, { size: 22, bold: true, color: fg })],
              { fill: bg, borders: noBorders, ml: 0, mr: 0, mt: 40, mb: 100 }),
            cell([para("Investment",         { bold: true, size: 18, color: fg }), para(price, { size: 22, bold: true, color: fg })],
              { fill: bg, borders: noBorders, ml: 0, mr: 0, mt: 40, mb: 100 }),
          ]})]
        }),
      ], { fill: bg, borders: noBorders, ml: 220, mr: 220, mt: 0, mb: 160 })] }),
    ],
  });

// ─── FEATURE TABLE ────────────────────────────────────────────────────────────
const featureTable = (groups, accent) => {
  const rows = [];
  rows.push(new TableRow({ tableHeader: true, children: [
    cell([para("Feature Group",   { bold: true, size: 20, color: C.white })], { fill: accent, borders: allBorders(accent), width: 4680 }),
    cell([para("What's Included", { bold: true, size: 20, color: C.white })], { fill: accent, borders: allBorders(accent), width: 3600 }),
    cell([para("Est. Hours",       { bold: true, size: 20, color: C.white, align: AlignmentType.CENTER })], { fill: accent, borders: allBorders(accent), width: 1080 }),
  ]}));
  groups.forEach((g, i) => {
    const bg = i % 2 === 0 ? C.white : C.lightGray;
    rows.push(new TableRow({ children: [
      cell([para(g.name, { bold: true, size: 20, color: C.primary })],
        { fill: bg, borders: allBorders(C.midGray), width: 4680, vAlign: VerticalAlign.TOP }),
      cell(g.features.map(f => new Paragraph({
        numbering: { reference: "bullets", level: 0 }, ...sp(20, 20),
        children: [new TextRun({ text: f, size: 18, color: C.darkGray, font: "Arial" })],
      })), { fill: bg, borders: allBorders(C.midGray), width: 3600, vAlign: VerticalAlign.TOP }),
      cell([para(g.hours, { size: 18, color: C.mutedText, align: AlignmentType.CENTER })],
        { fill: bg, borders: allBorders(C.midGray), width: 1080, vAlign: VerticalAlign.CENTER }),
    ]}));
  });
  return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [4680, 3600, 1080], rows });
};

// ─── COMPARISON TABLE ROW ─────────────────────────────────────────────────────
const compRow = (feature, s, st, adv, isHeader = false) => {
  const tick = (v, col) => para(v, {
    size: 19, bold: v === "✓", align: AlignmentType.CENTER,
    color: v === "✓" ? col : C.mutedText,
  });
  return new TableRow({ tableHeader: isHeader, children: [
    cell([para(feature, { bold: isHeader, size: isHeader ? 20 : 19, color: isHeader ? C.white : C.black })],
      { fill: isHeader ? C.primary : C.white, borders: allBorders(C.midGray), width: 3600 }),
    cell([tick(s, C.starter)],
      { fill: isHeader ? C.starter  : (s  === "✓" ? "F0FAF5" : C.white), borders: allBorders(C.midGray), width: 2048, vAlign: VerticalAlign.CENTER }),
    cell([tick(st, C.standard)],
      { fill: isHeader ? C.standard : (st === "✓" ? "EBF3FC" : C.white), borders: allBorders(C.midGray), width: 2048, vAlign: VerticalAlign.CENTER }),
    cell([tick(adv, C.advanced)],
      { fill: isHeader ? C.advanced : (adv === "✓" ? "F2EFFE" : C.white), borders: allBorders(C.midGray), width: 2050, vAlign: VerticalAlign.CENTER }),
  ]});
};

// ─── PRICING ─────────────────────────────────────────────────────────────────
const STARTER_PRICE   = "BDT 6,60,000 – 8,25,000";
const STANDARD_PRICE  = "BDT 11,55,000 – 14,85,000";
const ADVANCED_PRICE  = "BDT 20,00,000 – 26,00,000";
const STARTER_HOURS   = "310 – 350 hrs";
const STANDARD_HOURS  = "490 – 550 hrs  (Starter + ~180 hrs)";
const ADVANCED_HOURS  = "800 – 900 hrs  (Standard + ~310 hrs)";
const STARTER_WEEKS   = "10 – 12 weeks";
const STANDARD_WEEKS  = "16 – 19 weeks";
const ADVANCED_WEEKS  = "28 – 36 weeks";

// ─── SCOPE DATA ───────────────────────────────────────────────────────────────

// ── STARTER ──
const S_PUBLIC = [
  { name: "Landing page", hours: "20–24 hrs", features: [
    "Hero section, value proposition & primary CTA",
    "Featured course cards section",
    "Testimonials / social proof section",
    "FAQ accordion",
    "Responsive navigation with login / signup",
    "Footer with contact info and links",
  ]},
  { name: "Course listing page", hours: "12–16 hrs", features: [
    "Grid / list view of all published courses",
    "Filter by class level (8–12) and price range",
    "Live search bar with instant results",
    "Course card: thumbnail, title, price, enrolled count",
  ]},
  { name: "Course detail page", hours: "14–18 hrs", features: [
    "Course overview, outcomes, and instructor bio",
    "Curriculum preview (modules listed, chapters locked until enrolled)",
    "Pricing panel with enroll / buy CTA",
    "Pre-booking support (student registers interest before course launches)",
    "Publicly approved student reviews section",
  ]},
  { name: "Auth pages", hours: "10–12 hrs", features: [
    "Google OAuth login and signup (single flow)",
    "Max 2 concurrent device sessions per account",
    "Forced logout of oldest session on 3rd login",
    "Forgot password via email OTP",
  ]},
];

const S_STUDENT = [
  { name: "Student dashboard", hours: "14–18 hrs", features: [
    "Enrolled course cards with progress percentage",
    "Quick-resume: jump to last viewed class",
    "Upcoming class schedule from course routine",
  ]},
  { name: "Course-specific dashboard", hours: "12–16 hrs", features: [
    "Overall course progress bar (% of modules completed)",
    "Module-by-module completion tracker",
    "Weekly class schedule / routine for this course",
    "Pinned course-specific announcements",
  ]},
  { name: "LMS viewer — modules & classes", hours: "24–28 hrs", features: [
    "Left sidebar: ordered module list with lock / unlock state",
    "Chapter list within each module",
    "Embedded video player (YouTube or Google Drive links)",
    "PDF viewer for uploaded class materials",
    "Mark class as complete (increments overall progress %)",
    "Live class join link posted by admin before class",
    "Recording link posted by admin after class ends",
    "Like button on modules",
  ]},
  { name: "Notifications & announcements", hours: "10–12 hrs", features: [
    "In-app notification bell with unread count badge",
    "Global announcements (all students) and course-specific announcements",
    "Email notification on each new announcement",
    "Mark as read / clear all",
  ]},
  { name: "Student profile page", hours: "10–12 hrs", features: [
    "Edit display name, profile photo, phone number, class level",
    "Enrolled courses list with individual progress",
    "Full payment and transaction history",
    "Bkash pending submission status view",
    "Change password",
  ]},
];

const S_ADMIN = [
  { name: "Admin overview dashboard", hours: "16–20 hrs", features: [
    "Summary cards: total students, total revenue, active courses, new enrollments today",
    "Recent enrollments and payments tables",
    "Quick-action shortcuts: add course, view pending Bkash, post announcement",
  ]},
  { name: "Course management", hours: "24–30 hrs", features: [
    "Create, edit, archive, or delete courses",
    "Set price, thumbnail, description, class level, enrollment status",
    "Manage modules: add, rename, reorder, delete",
    "Manage chapters within modules: add, reorder, delete",
    "Upload PDF resource per chapter",
    "Embed video URL per chapter (YouTube / Google Drive)",
    "Post live class meeting link before class",
    "Replace meeting link with recording link after class ends",
    "Configure post-purchase instructions shown to student after enrollment",
    "Course status: Draft / Live / Archived",
  ]},
  { name: "Student management", hours: "16–20 hrs", features: [
    "Student list with search and filters (class level, course)",
    "View individual student profile: enrolled courses, progress, payment history",
    "Manually grant or revoke course access",
    "View and manage student active device sessions",
  ]},
  { name: "Payment — SSLCommerz", hours: "10–14 hrs", features: [
    "SSLCommerz gateway integration (card, bKash via gateway, Nagad)",
    "Automatic access grant on successful payment callback",
    "Payment log with CSV export",
  ]},
  { name: "Payment — manual Bkash queue", hours: "10–14 hrs", features: [
    "Student submits: Bkash TrxID, sender phone number, course selected",
    "Instant email alert sent to all admin accounts on submission",
    "Admin sees pending approval queue with full submission details",
    "Approve: course access granted immediately + student notified by email & in-app",
    "Reject: student notified with reason and can resubmit",
    "6-hour SLA displayed to student on the pending screen",
    "Submissions older than 6 hours flagged in red in the admin queue",
    "Full Bkash submission audit log with CSV export",
  ]},
  { name: "Announcement management", hours: "8–10 hrs", features: [
    "Create global or course-specific announcements",
    "Schedule announcement for a future date and time",
    "Email + in-app delivery on publish",
    "Edit, archive, or delete announcements",
  ]},
  { name: "Review management", hours: "6–8 hrs", features: [
    "View all student-submitted reviews per course",
    "Approve (shows publicly on course page) or reject (hidden)",
    "Delete inappropriate reviews",
  ]},
  { name: "RBAC — role management", hours: "12–16 hrs", features: [
    "Three roles: Super Admin, Course Manager, Support",
    "Super Admin: full platform access + manage other admins",
    "Course Manager: manage own courses, view enrolled students, post announcements",
    "Support: view students, handle Bkash queue, reply to discussions",
    "Invite admin by email, set role on invite",
    "Deactivate or delete admin accounts",
  ]},
  { name: "Routine management", hours: "8–10 hrs", features: [
    "Create weekly class schedule per course (day, time, topic)",
    "Students see the routine on their course dashboard",
    "Edit or delete individual schedule slots",
  ]},
];

const S_INFRA = [
  { name: "Tech stack & architecture", hours: "16–20 hrs", features: [
    "Next.js 14 App Router (frontend)",
    "Node.js + Express REST API (backend)",
    "PostgreSQL + Prisma ORM",
    "JWT access tokens + refresh token rotation",
    "Cloud storage for PDF uploads (Cloudflare R2 or AWS S3)",
    "Transactional email service (Resend / Nodemailer)",
  ]},
  { name: "Security & session control", hours: "10–12 hrs", features: [
    "Device session table: enforce max 2 concurrent sessions",
    "bcrypt password hashing",
    "HTTPS enforced in production",
    "API rate limiting (per IP and per user)",
    "Input validation and SQL injection protection via Prisma",
    "XSS protection headers (helmet.js)",
  ]},
  { name: "Deployment & CI", hours: "8–10 hrs", features: [
    "Frontend on Vercel, backend on Railway or Render",
    "PostgreSQL on Railway or Supabase",
    "GitHub Actions CI: lint + build check on push",
    "Automated daily database backups",
  ]},
];

// ── STANDARD (additions only) ──
const ST_STUDENT = [
  { name: "MCQ quizzes", hours: "20–24 hrs", features: [
    "Admin attaches a quiz to any module or chapter",
    "Auto-graded immediately on submission",
    "Score shown with correct / incorrect breakdown",
    "Score saved to student progress record",
    "Configurable: time limit, pass score, max retake attempts",
  ]},
  { name: "Short-answer assignments", hours: "14–18 hrs", features: [
    "Student submits a typed written answer",
    "Admin grades manually and provides written feedback",
    "Student notified by email + in-app when graded",
    "Submission status: Not submitted / Submitted / Graded",
  ]},
  { name: "Global search", hours: "8–10 hrs", features: [
    "Search across course titles, module names, and chapter names",
    "Live suggestions as the user types (debounced)",
    "Results grouped by type: Courses / Modules / Chapters",
  ]},
];

const ST_ADMIN = [
  { name: "Quiz & assignment management", hours: "16–20 hrs", features: [
    "Quiz builder: add, edit, reorder, and delete questions",
    "Set time limit, pass score threshold, and retake limit",
    "View all student submissions per quiz",
    "Grade short-answer submissions and enter written feedback",
    "Gradebook: all students x all assessments in a grid",
    "Export gradebook to CSV",
  ]},
  { name: "Analytics dashboard", hours: "22–28 hrs", features: [
    "Enrollment trends over time (chart by week / month)",
    "Revenue trends by day, week, or month",
    "Course completion rates per course",
    "Module completion heatmap (where students drop off)",
    "Per-student progress table: completion %, last active date",
    "Most and least engaged courses",
    "All charts and tables exportable to CSV / Excel",
  ]},
  { name: "Coupon management", hours: "10–12 hrs", features: [
    "Create discount codes: percentage or fixed BDT amount",
    "Set expiry date, total usage limit, and per-user limit",
    "Apply to specific courses or all courses",
    "Coupon usage report: who used which code, when, on which course",
  ]},
  { name: "Admin action audit log", hours: "10–12 hrs", features: [
    "Every admin action recorded: who did what, on which record, and when",
    "Covers course changes, student access grants, payment approvals, role changes",
    "Viewable and filterable by Super Admin",
    "Exportable to CSV",
  ]},
];

const ST_PLATFORM = [
  { name: "CDN integration", hours: "8–10 hrs", features: [
    "CDN configured for all uploaded PDFs and static assets",
    "Faster load times for students across Bangladesh",
    "Reduces direct server load significantly",
    "Cloudflare CDN (pairs with R2 storage already in Starter)",
  ]},
  { name: "Transactional email system (upgraded)", hours: "10–12 hrs", features: [
    "Welcome email on first signup",
    "Payment confirmation (SSLCommerz + Bkash approval)",
    "Course access granted email with post-purchase instructions",
    "Assignment graded notification email",
    "Branded HTML email templates with MathPro identity",
    "Unsubscribe link in all non-transactional emails",
  ]},
];

// ── ADVANCED (additions only) ──
const ADV_ENGAGEMENT = [
  { name: "XP points system", hours: "16–20 hrs", features: [
    "XP awarded for: completing modules, passing quizzes, daily login streak",
    "XP balance displayed on student profile and course dashboard",
    "XP rules fully configurable by Super Admin (points per action)",
  ]},
  { name: "Leaderboard", hours: "14–18 hrs", features: [
    "Course-specific leaderboard: top students per course",
    "Global leaderboard: top students across all courses",
    "Weekly and all-time leaderboard views",
    "Top 3 highlighted with gold / silver / bronze styling",
    "Student's own rank always visible even if outside top 10",
    "Admin can reset weekly leaderboard manually or on schedule",
  ]},
  { name: "Badges & achievements", hours: "16–20 hrs", features: [
    "System badges: Course Completer, Quiz Champion, 7-Day Streak, First Enrollment",
    "Admin can create custom badges with name, icon, and description",
    "Admin can manually award or revoke any badge from a student profile",
    "Badge collection displayed on student profile page",
    "Toast notification popup when a badge is unlocked",
    "Badge count visible beside student name on leaderboard",
  ]},
  { name: "Module discussions & comments", hours: "18–22 hrs", features: [
    "Threaded discussion section per module (not per chapter)",
    "Students post questions or comments on any module",
    "Admin / teacher replies inline within the thread",
    "Like button on individual comments",
    "Report comment button (flagged comments go to moderation queue)",
    "Admin moderation queue: hide, delete, or dismiss reported comments",
    "Discussion visible to all enrolled students in that course",
  ]},
  { name: "Web push notifications (PWA)", hours: "14–18 hrs", features: [
    "Browser-level push notifications via service worker",
    "Triggers: new announcement, class starting soon, assignment graded",
    "Student can manage notification preferences in profile settings",
    "Admin can send a push notification to all students or course-specific",
    "Works on Android and desktop browsers; limited on iOS Safari",
  ]},
  { name: "Student inactivity re-engagement", hours: "10–12 hrs", features: [
    "Automatic email triggered if student has not logged in for X days (configurable)",
    "Email includes a direct link back to their last active course",
    "Admin can configure the inactivity threshold (default: 7 days)",
    "Admin can enable or disable the re-engagement trigger per course",
    "Re-engagement send log viewable in admin panel",
  ]},
  { name: "Bulk announcement targeting", hours: "8–10 hrs", features: [
    "Send announcements to a specific student segment",
    "Segments: by course, by class level, or by enrollment date range",
    "Email + in-app delivery",
    "Preview recipient count before sending",
  ]},
];

const ADV_INFRA = [
  { name: "Redis caching layer", hours: "14–18 hrs", features: [
    "Cache leaderboard queries (expensive aggregations served instantly)",
    "Cache analytics dashboard data (refreshed on schedule)",
    "Cache user session data to reduce database reads",
    "Configurable TTL (time-to-live) per cache type",
  ]},
  { name: "Bull / BullMQ background job queue", hours: "16–20 hrs", features: [
    "Email delivery moved off the main request thread",
    "Push notification dispatch queued and processed in background",
    "XP calculations and leaderboard updates run as background jobs",
    "Re-engagement email automation handled by scheduled jobs",
    "Job retry logic: failed jobs automatically retried with backoff",
    "Admin job monitoring dashboard (Bull Board)",
  ]},
  { name: "PgBouncer — database connection pooling", hours: "8–10 hrs", features: [
    "Connection pooler in front of PostgreSQL to handle traffic spikes",
    "Prevents database connection exhaustion under high concurrency",
    "Configured in transaction pooling mode for API workloads",
    "Essential for 1,000+ concurrent users",
  ]},
  { name: "Horizontal scaling readiness", hours: "10–14 hrs", features: [
    "API server audit: ensure fully stateless (no in-memory session state)",
    "Sessions and rate limit counters moved to Redis (not in-process)",
    "File uploads routed through cloud storage only (no local disk dependency)",
    "Architecture documented for future multi-instance deployment",
  ]},
  { name: "Monitoring, alerting & uptime", hours: "12–16 hrs", features: [
    "Sentry error monitoring: real-time error capture on frontend and backend",
    "Alert thresholds: notify admin by email if error rate spikes",
    "UptimeRobot or Better Uptime integration for uptime monitoring",
    "Public or private status page showing platform health",
    "Automated backup restore-test (weekly restore to staging to verify backup integrity)",
  ]},
];

const ADV_CONTENT = [
  { name: "Progressive Web App (PWA)", hours: "14–18 hrs", features: [
    "Full PWA manifest with app name, icons, and MathPro theme color",
    "Service worker for offline shell (navigation works without connection)",
    "Installable on Android home screen and iOS Safari",
    "App opens full-screen with no browser chrome",
    "Pairs with push notifications for a near-native experience",
  ]},
  { name: "Bangla / English language toggle", hours: "18–24 hrs", features: [
    "next-intl i18n framework integration",
    "Language switcher in the navbar (BD flag / EN toggle)",
    "All UI strings (labels, buttons, error messages) translateable",
    "Client provides all Bangla translation strings (dev covers the framework only)",
    "Language preference saved per user profile",
    "Bangla Unicode font loaded via next/font",
  ]},
  { name: "Video watch progress tracking", hours: "16–20 hrs", features: [
    "Track exactly how far each student has watched each video",
    "Progress bar on the video player reflects saved watch position",
    "Student can resume from where they left off on any device",
    "Watch percentage stored per chapter per student",
  ]},
  { name: "Adaptive content locking", hours: "12–16 hrs", features: [
    "Admin sets a minimum watch percentage required to unlock the next chapter",
    "Student cannot proceed until the threshold is met (e.g. 80% watched)",
    "Configurable per module or per chapter",
    "Student sees a clear message explaining why the next chapter is locked",
  ]},
  { name: "Advanced reporting", hours: "20–26 hrs", features: [
    "Sales report: filter by date range, course, and payment method",
    "Student performance report: average quiz scores, assignment completion rates",
    "Cohort analysis: group students by enrollment date, track progress over time",
    "Inactive student report: students with no activity beyond a configurable threshold",
    "All reports exportable to CSV, Excel, and PDF",
  ]},
  { name: "Webhook system + API access", hours: "16–20 hrs", features: [
    "Outgoing webhook on key events: new enrollment, payment confirmed, course completed",
    "Admin can configure webhook endpoint URL and secret key",
    "Webhook delivery log with retry on failure",
    "Read-only API key for MathPro to query their own student and revenue data",
    "API key generated and managed in the Super Admin panel",
    "API documentation provided (Postman collection or OpenAPI spec)",
  ]},
];

// ─── DOCUMENT ─────────────────────────────────────────────────────────────────
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22, color: C.black } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: C.primary },
        paragraph: { spacing: { before: 300, after: 120 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: C.accent },
        paragraph: { spacing: { before: 240, after: 80 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: C.darkGray },
        paragraph: { spacing: { before: 180, after: 60 }, outlineLevel: 2 } },
    ],
  },
  numbering: { config: [
    { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 480, hanging: 240 } }, run: { font: "Arial" } } }] },
    { reference: "steps", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 480, hanging: 240 } }, run: { font: "Arial" } } }] },
  ]},
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
      },
    },
    headers: { default: new Header({ children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.midGray, space: 4 } },
        ...sp(0, 80),
        children: [
          new TextRun({ text: "MathPro LMS — Project Proposal  |  ", size: 18, color: C.mutedText, font: "Arial" }),
          new TextRun({ text: "Parvej Shah @ Codervai", size: 18, color: C.accent, bold: true, font: "Arial" }),
        ],
      }),
    ]})},
    footers: { default: new Footer({ children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.midGray, space: 4 } },
        ...sp(80, 0),
        children: [
          new TextRun({ text: "Confidential — Prepared by Parvej Shah, Codervai  |  Page ", size: 16, color: C.mutedText, font: "Arial" }),
          new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.mutedText, font: "Arial" }),
          new TextRun({ text: " of ", size: 16, color: C.mutedText, font: "Arial" }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: C.mutedText, font: "Arial" }),
        ],
      }),
    ]})},

    children: [

      // ══ COVER PAGE ══════════════════════════════════════════════════════════
      new Table({
        width: { size: 9746, type: WidthType.DXA }, columnWidths: [9746], borders: noBorders,
        rows: [new TableRow({ children: [cell([
          para("PROJECT PROPOSAL", { bold: true, size: 18, color: "99C4E8", after: 100, align: AlignmentType.CENTER }),
          para("MathPro LMS Platform", { bold: true, size: 56, color: C.white, after: 140, align: AlignmentType.CENTER }),
          para("A tiered Learning Management System for online math coaching — Classes 8 to 12, Dhaka, Bangladesh",
            { size: 22, color: "CCE0F5", after: 240, align: AlignmentType.CENTER }),
          rule(),
          gap(120, 120),
          new Table({
            width: { size: 9306, type: WidthType.DXA }, columnWidths: [3102, 3102, 3102], borders: noBorders,
            rows: [new TableRow({ children: [
              cell([para("Prepared by", { size: 18, color: "99C4E8" }), para("Parvej Shah", { bold: true, size: 24, color: C.white }), para("Codervai", { size: 20, color: "99C4E8" })],
                { fill: C.primary, borders: noBorders, ml: 0, mr: 0 }),
              cell([para("Prepared for", { size: 18, color: "99C4E8" }), para("MathPro", { bold: true, size: 24, color: C.white }), para("Online Math Coaching", { size: 20, color: "99C4E8" })],
                { fill: C.primary, borders: noBorders, ml: 0, mr: 0 }),
              cell([para("Date", { size: 18, color: "99C4E8" }), para("May 2025", { bold: true, size: 24, color: C.white }), para("Version 2.0", { size: 20, color: "99C4E8" })],
                { fill: C.primary, borders: noBorders, ml: 0, mr: 0 }),
            ]})]
          }),
          gap(200, 80),
          new Table({
            width: { size: 9306, type: WidthType.DXA }, columnWidths: [3102, 3102, 3102], borders: noBorders,
            rows: [new TableRow({ children: [
              cell([para("STARTER",  { bold: true, size: 20, color: C.white, align: AlignmentType.CENTER }), para("Foundation MVP",     { size: 18, color: "C8EAD8", align: AlignmentType.CENTER }), para(STARTER_PRICE,  { size: 17, color: C.white, align: AlignmentType.CENTER })],
                { fill: C.starter,  borders: noBorders, mt: 120, mb: 120 }),
              cell([para("STANDARD", { bold: true, size: 20, color: C.white, align: AlignmentType.CENTER }), para("Complete LMS",        { size: 18, color: "C5D9F1", align: AlignmentType.CENTER }), para(STANDARD_PRICE, { size: 17, color: C.white, align: AlignmentType.CENTER })],
                { fill: C.standard, borders: noBorders, mt: 120, mb: 120 }),
              cell([para("ADVANCED", { bold: true, size: 20, color: C.white, align: AlignmentType.CENTER }), para("Scale & Growth",      { size: 18, color: "D5C8F5", align: AlignmentType.CENTER }), para(ADVANCED_PRICE, { size: 17, color: C.white, align: AlignmentType.CENTER })],
                { fill: C.advanced, borders: noBorders, mt: 120, mb: 120 }),
            ]})]
          }),
        ], { fill: C.primary, borders: noBorders, mt: 400, mb: 400, ml: 200, mr: 200 })]})]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // ══ SECTION 1: INTRODUCTION ════════════════════════════════════════════
      h1("1. Introduction"),
      para("This proposal outlines the full scope, timeline, and investment for building the MathPro LMS — a purpose-built Learning Management System for MathPro's online math coaching platform, serving students of Classes 8 to 12 in Dhaka, Bangladesh.", { after: 120, size: 22 }),
      para("The platform is designed for two types of users: students who browse, purchase, and consume course content; and administrators (teachers) who manage courses, students, payments, and all platform operations.", { after: 120, size: 22 }),
      para("The scope is structured into three progressive tiers to give MathPro full flexibility in choosing what best fits their current stage and budget:", { after: 80, size: 22 }),
      bullet("Starter — A fully functional, shippable LMS. Sell courses, take payments, deliver content, and manage students from day one.", false, C.starter),
      bullet("Standard — The complete, production-ready LMS. Everything MathPro needs to run a professional, scalable coaching platform.", false, C.standard),
      bullet("Advanced — The scale and growth layer. Built for when MathPro outgrows Standard: gamification, infrastructure scaling, PWA, bilingual support, and integration capabilities.", false, C.advanced),
      gap(80),
      para("Each tier is fully inclusive of all features in the tier below it. Standard is designed to be the sweet spot for most coaching platforms at MathPro's current stage. Advanced is positioned as a future upgrade — when student numbers grow and the platform needs to handle higher traffic, deliver richer engagement, and integrate with external tools.", { size: 20, italic: true, color: C.mutedText, after: 80 }),

      gap(),
      // ══ SECTION 2: PROJECT OVERVIEW ════════════════════════════════════════
      h1("2. Project Overview"),
      new Table({
        width: { size: 9746, type: WidthType.DXA }, columnWidths: [3000, 6746],
        rows: [
          ["Client",            "MathPro — Online Math Coaching Platform, Dhaka, Bangladesh"],
          ["Target Users",      "Students (Classes 8–12) and Administrators / Teachers"],
          ["Tech Stack",        "Next.js 14, Node.js + Express, PostgreSQL + Prisma ORM"],
          ["Payment Methods",   "SSLCommerz (card, bKash via gateway, Nagad) + Manual Bkash queue"],
          ["Authentication",    "Google OAuth + max 2 concurrent device sessions per account"],
          ["Currency",          "BDT (Bangladeshi Taka)"],
          ["Mobile Support",    "Mobile-responsive app (PWA — installable — Advanced tier)"],
          ["Language",          "English (Starter & Standard) + Bangla/English toggle (Advanced)"],
        ].map(([label, value], i) => new TableRow({ children: [
          cell([para(label, { bold: true, size: 20, color: C.white })],
            { fill: i % 2 === 0 ? C.primary : C.accent, borders: allBorders(C.primary), width: 3000, mt: 80, mb: 80 }),
          cell([para(value, { size: 20 })],
            { fill: i % 2 === 0 ? C.lightGray : C.white, borders: allBorders(C.midGray), width: 6746, mt: 80, mb: 80 }),
        ]})),
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // ══ SECTION 3: COMPARISON TABLE ════════════════════════════════════════
      h1("3. Tier Comparison at a Glance"),
      para("Features marked with a check are included in that tier. Each higher tier includes everything from the tier below it.", { after: 160, size: 20, italic: true, color: C.mutedText }),
      new Table({
        width: { size: 9746, type: WidthType.DXA }, columnWidths: [3600, 2048, 2048, 2050],
        rows: [
          compRow("Feature", "Starter", "Standard", "Advanced", true),
          // Starter
          compRow("Landing page + course listing", "✓", "✓", "✓"),
          compRow("Course detail + pre-booking", "✓", "✓", "✓"),
          compRow("Google OAuth + 2-device session limit", "✓", "✓", "✓"),
          compRow("LMS viewer (video embed + PDF + module likes)", "✓", "✓", "✓"),
          compRow("Live class join link + recording link", "✓", "✓", "✓"),
          compRow("Student dashboard + progress tracking", "✓", "✓", "✓"),
          compRow("Course-specific dashboard + routine", "✓", "✓", "✓"),
          compRow("In-app notifications + announcements (email + in-app)", "✓", "✓", "✓"),
          compRow("Student profile page", "✓", "✓", "✓"),
          compRow("SSLCommerz payment gateway", "✓", "✓", "✓"),
          compRow("Manual Bkash queue (6-hr SLA, email alert)", "✓", "✓", "✓"),
          compRow("Course management (modules, chapters, PDFs, video)", "✓", "✓", "✓"),
          compRow("Student management (grant/revoke access)", "✓", "✓", "✓"),
          compRow("Review management (approve/reject)", "✓", "✓", "✓"),
          compRow("RBAC — 3 admin roles", "✓", "✓", "✓"),
          compRow("Routine management", "✓", "✓", "✓"),
          // Standard additions
          compRow("MCQ quizzes (auto-graded)", "—", "✓", "✓"),
          compRow("Short-answer assignments (manual grading)", "—", "✓", "✓"),
          compRow("Gradebook + quiz analytics", "—", "✓", "✓"),
          compRow("Coupon / discount code system", "—", "✓", "✓"),
          compRow("Analytics dashboard (charts + CSV/Excel export)", "—", "✓", "✓"),
          compRow("Global search (courses, modules, chapters)", "—", "✓", "✓"),
          compRow("Admin action audit log (exportable)", "—", "✓", "✓"),
          compRow("CDN for PDFs and static assets", "—", "✓", "✓"),
          compRow("Branded transactional email system", "—", "✓", "✓"),
          // Advanced additions
          compRow("XP points + leaderboard (course + global)", "—", "—", "✓"),
          compRow("Badges & achievements", "—", "—", "✓"),
          compRow("Module discussions & threaded comments", "—", "—", "✓"),
          compRow("Web push notifications (PWA)", "—", "—", "✓"),
          compRow("Student inactivity re-engagement email", "—", "—", "✓"),
          compRow("Bulk announcement targeting by segment", "—", "—", "✓"),
          compRow("Progressive Web App (installable on mobile)", "—", "—", "✓"),
          compRow("Bangla / English language toggle", "—", "—", "✓"),
          compRow("Video watch progress + adaptive content locking", "—", "—", "✓"),
          compRow("Advanced reporting (cohort, sales, PDF export)", "—", "—", "✓"),
          compRow("Redis caching + Bull job queue", "—", "—", "✓"),
          compRow("PgBouncer connection pooling", "—", "—", "✓"),
          compRow("Horizontal scaling readiness audit", "—", "—", "✓"),
          compRow("Sentry monitoring + uptime status page", "—", "—", "✓"),
          compRow("Automated backup restore-testing", "—", "—", "✓"),
          compRow("Webhook system + read-only API key", "—", "—", "✓"),
        ],
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // ══ SECTION 4: STARTER ═════════════════════════════════════════════════
      h1("4. Tier 1 — Starter", C.starter),
      tierBanner("Starter — Foundation LMS",
        "A fully functional LMS MVP. Sell courses, take payments, deliver content, and manage students from day one.",
        STARTER_HOURS, STARTER_PRICE, STARTER_WEEKS, C.starterBg, C.starter),
      gap(160),

      h2("4.1  Public-facing pages", C.starter),
      featureTable(S_PUBLIC, C.starter), gap(120),

      h2("4.2  Student features", C.starter),
      featureTable(S_STUDENT, C.starter), gap(120),

      h2("4.3  Admin / teacher panel", C.starter),
      featureTable(S_ADMIN, C.starter), gap(120),

      h2("4.4  Core infrastructure", C.starter),
      featureTable(S_INFRA, C.starter), gap(120),

      h2("4.5  How the manual Bkash payment flow works", C.starter),
      para("Since MathPro uses a personal Bkash account (not Bkash Merchant API), automated verification is not possible. The following workflow keeps the process fast, transparent, and auditable:", { after: 100, size: 21 }),
      bullet("Student selects a course and chooses Pay with Bkash"),
      bullet("Student sends the course fee to MathPro's Bkash number manually"),
      bullet("Student submits: Transaction ID, sender phone number, and course — via an on-screen form"),
      bullet("Admin receives an instant email notification with the full submission details"),
      bullet("Submission appears in the admin's Bkash pending queue"),
      bullet("Admin verifies the TrxID against their Bkash history and clicks Approve or Reject"),
      bullet("On approval: access granted immediately, student notified by email and in-app"),
      bullet("On rejection: student notified with a reason, can resubmit"),
      bullet("Submissions older than 6 hours are flagged in red in the queue"),
      bullet("Full audit log of all submissions is exportable to CSV at any time"),
      gap(80),
      para("This approach requires zero third-party API dependency and is fully upgradeable to Bkash Merchant API in a future phase.", { size: 20, italic: true, color: C.mutedText }),

      gap(80),
      h2("4.6  Starter — notes & assumptions", C.starter),
      bullet("SSLCommerz merchant onboarding (1–2 weeks) is handled directly by MathPro with SSLCommerz"),
      bullet("Video content hosted externally on YouTube or Google Drive — no video hosting cost included"),
      bullet("PDF uploads stored on Cloudflare R2 or AWS S3 — storage cost is the client's responsibility"),
      bullet("Time estimates cover design, development, testing, and deployment. Content migration not included"),
      bullet("A staging environment is included; production server provisioning is the client's responsibility"),

      new Paragraph({ children: [new PageBreak()] }),

      // ══ SECTION 5: STANDARD ════════════════════════════════════════════════
      h1("5. Tier 2 — Standard", C.standard),
      tierBanner("Standard — The Complete, Production-Ready LMS",
        "Everything in Starter, plus quizzes, assignments, analytics, audit log, CDN, coupon system, and global search. Everything MathPro needs to run a professional coaching platform.",
        STANDARD_HOURS, STANDARD_PRICE, STANDARD_WEEKS, C.standardBg, C.standard),
      gap(120),
      para("Standard includes every feature from Tier 1 (Starter) plus the additions below. No features are removed — only added.", { after: 120, size: 21, bold: true, color: C.standard }),

      h2("5.1  New student features", C.standard),
      featureTable(ST_STUDENT, C.standard), gap(120),

      h2("5.2  New admin features", C.standard),
      featureTable(ST_ADMIN, C.standard), gap(120),

      h2("5.3  Platform additions", C.standard),
      featureTable(ST_PLATFORM, C.standard), gap(120),

      h2("5.4  Why Standard is the recommended tier", C.standard),
      para("Standard is designed to be the complete package for MathPro at its current stage. Here is what it adds over Starter that makes a real operational difference:", { after: 100, size: 21 }),
      bullet("Quizzes and assignments turn passive video-watching into active learning — proven to increase course completion rates"),
      bullet("The analytics dashboard gives MathPro data to make decisions: which courses are working, where students drop off, how revenue is trending"),
      bullet("The coupon system enables promotional campaigns, referral discounts, and batch enrollments for school groups"),
      bullet("The admin audit log means every action on the platform is traceable — critical for a multi-admin team"),
      bullet("CDN integration means faster PDF and asset delivery for students across Bangladesh with no extra server load"),
      bullet("Global search means students can find exactly what they need without browsing — reduces friction and increases engagement"),
      gap(80),
      para("Standard is not a scaled-down version of Advanced — it is a fully complete, professional LMS that MathPro can run confidently for years.", { size: 20, italic: true, color: C.mutedText }),

      gap(80),
      h2("5.5  Standard — notes & assumptions", C.standard),
      bullet("Short-answer assignment grading is manual — admin enters grade and feedback per student submission"),
      bullet("Bangla language support is an Advanced-tier feature; Standard is English only"),
      bullet("Analytics exports are CSV or Excel; PDF report export is Advanced"),
      bullet("CDN is Cloudflare CDN, paired with R2 storage already in Starter infrastructure"),

      new Paragraph({ children: [new PageBreak()] }),

      // ══ SECTION 6: ADVANCED ════════════════════════════════════════════════
      h1("6. Tier 3 — Advanced", C.advanced),
      tierBanner("Advanced — Scale, Growth & Infrastructure",
        "Everything in Standard, plus gamification, PWA, bilingual support, infrastructure scaling, video progress tracking, and integration capabilities. Built for when MathPro is ready to grow.",
        ADVANCED_HOURS, ADVANCED_PRICE, ADVANCED_WEEKS, C.advancedBg, C.advanced),
      gap(120),
      para("Advanced includes every feature from Tier 2 (Standard) plus the additions below, organized into three clear pillars.", { after: 120, size: 21, bold: true, color: C.advanced }),

      h2("6.1  Pillar 1 — Engagement & Gamification", C.advanced),
      featureTable(ADV_ENGAGEMENT, C.advanced), gap(120),

      h2("6.2  Pillar 2 — Infrastructure & Scalability", C.advanced),
      featureTable(ADV_INFRA, C.advanced), gap(120),

      h2("6.3  Pillar 3 — Advanced Content, Reporting & Integration", C.advanced),
      featureTable(ADV_CONTENT, C.advanced), gap(120),

      h2("6.4  What Advanced is really about", C.advanced),
      para("Advanced is not about adding more features for the sake of it. It is about three things:", { after: 100, size: 21 }),
      bullet("Scale — when MathPro grows from hundreds of students to thousands, the infrastructure layer (Redis, BullMQ, PgBouncer, CDN, horizontal scaling) ensures the platform does not slow down or break under load"),
      bullet("Retention — gamification (XP, leaderboards, badges), push notifications, and re-engagement automation are proven tools for keeping Class 8–12 students active and coming back"),
      bullet("Integration — the webhook system and API key open the door for MathPro to connect their platform to external tools, analytics systems, or future products without a full rebuild"),
      gap(80),
      para("Advanced is best approached as a Phase 2 engagement — after Standard is live, generating revenue, and MathPro has a clear picture of where they need to scale. This makes Advanced a natural conversation in 6–12 months.", { size: 20, italic: true, color: C.mutedText }),

      gap(80),
      h2("6.5  Advanced — notes & assumptions", C.advanced),
      bullet("Redis and BullMQ require a separate process alongside the API server — adds approximately BDT 700–1,400/month in hosting"),
      bullet("PgBouncer sits in front of PostgreSQL — minimal hosting cost, significant resilience benefit at scale"),
      bullet("Bangla translation strings must be provided by MathPro — dev effort covers the i18n framework only"),
      bullet("PWA push notifications work fully on Android and desktop Chrome; iOS Safari has limitations (no background push on older iOS versions)"),
      bullet("Webhook delivery is best-effort with retry; guaranteed delivery requires a message queue (available as a future addition)"),
      bullet("Video watch progress tracking uses YouTube/Drive embed events — does not require self-hosted video"),

      new Paragraph({ children: [new PageBreak()] }),

      // ══ SECTION 7: PRICING SUMMARY ═════════════════════════════════════════
      h1("7. Pricing Summary"),
      para("All prices are in Bangladeshi Taka (BDT). Time estimates include design, development, testing, and deployment. Hosting, domain, and third-party service costs are not included in any tier.", { after: 160, size: 20, italic: true, color: C.mutedText }),
      new Table({
        width: { size: 9746, type: WidthType.DXA }, columnWidths: [1800, 2800, 1700, 1700, 1746],
        rows: [
          new TableRow({ tableHeader: true, children: [
            cell([para("Tier",        { bold: true, size: 20, color: C.white })], { fill: C.primary, borders: allBorders(C.primary), width: 1800 }),
            cell([para("Investment",  { bold: true, size: 20, color: C.white })], { fill: C.primary, borders: allBorders(C.primary), width: 2800 }),
            cell([para("Dev Hours",   { bold: true, size: 20, color: C.white })], { fill: C.primary, borders: allBorders(C.primary), width: 1700 }),
            cell([para("Timeline",    { bold: true, size: 20, color: C.white })], { fill: C.primary, borders: allBorders(C.primary), width: 1700 }),
            cell([para("Includes",    { bold: true, size: 20, color: C.white })], { fill: C.primary, borders: allBorders(C.primary), width: 1746 }),
          ]}),
          new TableRow({ children: [
            cell([para("Starter",  { bold: true, size: 20, color: C.starter  })], { fill: "F0FAF5", borders: allBorders(C.midGray), width: 1800 }),
            cell([para(STARTER_PRICE,  { size: 20, bold: true })], { fill: "F0FAF5", borders: allBorders(C.midGray), width: 2800 }),
            cell([para("310–350 hrs",  { size: 20 })], { fill: "F0FAF5", borders: allBorders(C.midGray), width: 1700 }),
            cell([para("10–12 wks",    { size: 20 })], { fill: "F0FAF5", borders: allBorders(C.midGray), width: 1700 }),
            cell([para("MVP",          { size: 20 })], { fill: "F0FAF5", borders: allBorders(C.midGray), width: 1746 }),
          ]}),
          new TableRow({ children: [
            cell([para("Standard", { bold: true, size: 20, color: C.standard })], { fill: "EBF3FC", borders: allBorders(C.midGray), width: 1800 }),
            cell([para(STANDARD_PRICE, { size: 20, bold: true })], { fill: "EBF3FC", borders: allBorders(C.midGray), width: 2800 }),
            cell([para("490–550 hrs",  { size: 20 })], { fill: "EBF3FC", borders: allBorders(C.midGray), width: 1700 }),
            cell([para("16–19 wks",    { size: 20 })], { fill: "EBF3FC", borders: allBorders(C.midGray), width: 1700 }),
            cell([para("Starter +",    { size: 20 })], { fill: "EBF3FC", borders: allBorders(C.midGray), width: 1746 }),
          ]}),
          new TableRow({ children: [
            cell([para("Advanced", { bold: true, size: 20, color: C.advanced })], { fill: "F2EFFE", borders: allBorders(C.midGray), width: 1800 }),
            cell([para(ADVANCED_PRICE, { size: 20, bold: true })], { fill: "F2EFFE", borders: allBorders(C.midGray), width: 2800 }),
            cell([para("800–900 hrs",  { size: 20 })], { fill: "F2EFFE", borders: allBorders(C.midGray), width: 1700 }),
            cell([para("28–36 wks",    { size: 20 })], { fill: "F2EFFE", borders: allBorders(C.midGray), width: 1700 }),
            cell([para("Standard +",   { size: 20 })], { fill: "F2EFFE", borders: allBorders(C.midGray), width: 1746 }),
          ]}),
        ],
      }),
      gap(120),
      h2("Suggested payment terms"),
      bullet("40% upfront on contract signing — development begins immediately"),
      bullet("30% on mid-project milestone delivery (core features live on staging)"),
      bullet("30% on final delivery and client sign-off"),
      gap(80),
      para("Payment terms are fully negotiable and can be adjusted to suit MathPro's preferences.", { size: 20, italic: true, color: C.mutedText }),

      new Paragraph({ children: [new PageBreak()] }),

      // ══ SECTION 8: NOT INCLUDED ════════════════════════════════════════════
      h1("8. What Is Not Included"),
      para("The following are outside the scope of this proposal unless explicitly agreed upon in writing:", { after: 120, size: 22 }),
      bullet("Domain name registration and hosting server costs"),
      bullet("SSLCommerz merchant account setup — handled directly by MathPro with SSLCommerz"),
      bullet("Bkash personal account or Bkash Merchant API subscription"),
      bullet("Course content creation, video recording, or bulk content upload"),
      bullet("Bangla translation strings — client provides all translated UI content (Standard: English only; Advanced: framework + client-provided strings)"),
      bullet("Ongoing maintenance, bug fixes, or feature updates after delivery (can be quoted separately as a retainer)"),
      bullet("Native mobile app (iOS / Android) — platform is a web app; PWA available in Advanced tier"),
      bullet("AI-powered features (AI tutoring, content recommendations, automated grading)"),
      bullet("Penetration testing or formal third-party security audit"),
      bullet("SLA-backed uptime guarantee — available as a separate maintenance retainer"),

      gap(),
      // ══ SECTION 9: COMPETITIVE ADVANTAGE ══════════════════════════════════
      h1("9. Why This Platform Will Outperform the Competition"),
      para("MathPro's closest competitors — ft.education and redwansmethod.com — offer course content but lack a cohesive, purpose-built LMS. Here is what this platform does better:", { after: 160, size: 22 }),
      new Table({
        width: { size: 9746, type: WidthType.DXA }, columnWidths: [2600, 3573, 3573],
        rows: [
          new TableRow({ tableHeader: true, children: [
            cell([para("Advantage",                   { bold: true, size: 20, color: C.white })], { fill: C.primary, borders: allBorders(C.primary), width: 2600 }),
            cell([para("What it means for MathPro",   { bold: true, size: 20, color: C.white })], { fill: C.primary, borders: allBorders(C.primary), width: 3573 }),
            cell([para("Competitor gap",              { bold: true, size: 20, color: C.white })], { fill: C.primary, borders: allBorders(C.primary), width: 3573 }),
          ]}),
          ...[
            ["Structured progress tracking",    "Students see exactly how far they are in each course, reducing dropout and increasing motivation",       "Competitors show no per-student progress data"],
            ["Bkash-native payment flow",        "No student is turned away because they only have Bkash — the dominant payment method in Bangladesh",     "Most platforms support card or SSLCommerz only"],
            ["Live class + recording workflow",  "Admin posts the meeting link before class and replaces it with the recording after — all inside the platform", "Competitors share class links via WhatsApp or Telegram — fragmented and unprofessional"],
            ["Role-based admin system",          "MathPro can hire support staff and course managers with controlled access — no shared passwords",        "Competitors typically use one admin account for everything"],
            ["Quizzes + assignments (Standard)", "Active learning with auto-graded MCQs and manually graded short answers drives higher completion rates",  "Most coaching platforms in BD are video-only with no assessment layer"],
            ["Gamification (Advanced)",          "Leaderboards and badges keep Class 8–12 students competitive and engaged — proven retention driver for this age group", "No Bangladeshi math coaching platform currently offers this"],
            ["Scalability (Advanced)",           "Redis, BullMQ, PgBouncer, and scaling readiness mean the platform handles 5,000+ students as smoothly as 500", "Competitors will hit performance walls as they grow and need expensive rebuilds"],
          ].map(([adv, means, gapText], i) => new TableRow({ children: [
            cell([para(adv,   { bold: true, size: 19, color: C.primary })], { fill: i%2===0 ? C.lightGray : C.white, borders: allBorders(C.midGray), width: 2600 }),
            cell([para(means, { size: 19 })],                                { fill: i%2===0 ? C.lightGray : C.white, borders: allBorders(C.midGray), width: 3573 }),
            cell([para(gapText,  { size: 19, italic: true, color: C.mutedText })], { fill: i%2===0 ? C.lightGray : C.white, borders: allBorders(C.midGray), width: 3573 }),
          ]})),
        ],
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // ══ SECTION 10: NEXT STEPS ═════════════════════════════════════════════
      h1("10. Next Steps"),
      para("To move forward with this project, the following steps are proposed:", { after: 120, size: 22 }),
      numbered("MathPro selects a tier (Starter, Standard, or Advanced) — or requests a custom scope discussion"),
      numbered("A 30-minute discovery call to confirm final requirements, answer any questions, and align on timeline"),
      numbered("Contract and NDA signed"),
      numbered("40% upfront payment to begin development immediately"),
      numbered("Development begins — with weekly progress updates and a live staging environment for ongoing review"),
      gap(160),

      h2("Contact"),
      para("Parvej Shah — Full Stack Web Developer", { bold: true, size: 24 }),
      para("Codervai", { size: 22, color: C.accent, bold: true }),
      gap(60),
      para("This proposal is valid for 30 days from the date of issue. Prices and scope are subject to change after this period. All items are negotiable — if MathPro would like to adjust scope, move features between tiers, or discuss a custom package, that conversation is always welcome.", { size: 20, color: C.mutedText, italic: true }),

      gap(200),
      rule(),
      gap(80),
      para("Prepared with care for MathPro. Confidential — not to be shared without permission from Parvej Shah, Codervai.", { size: 18, color: C.mutedText, align: AlignmentType.CENTER, italic: true }),
    ],
  }],
});

Packer.toBuffer(doc).then(buf => {
  const outputPath = path.resolve(process.cwd(), 'MathPro_LMS_Proposal_v3.docx');
  fs.writeFileSync(outputPath, buf);
  console.log(`Done: ${outputPath}`);
});
