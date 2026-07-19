import type { IconKey } from "@/lib/icons";

/**
 * Course shape used across the site. `icon` is a STRING key (see lib/icons.ts)
 * rather than a component so the same shape works for both the static sample
 * data below and documents stored in MongoDB.
 */
export type Course = {
  slug: string;
  title: string;
  icon: IconKey;
  tagline: string;
  duration: string;
  batchSize: string;
  level: string;
  certification: string;
  syllabus: string[];
  careers: string[];
  featured?: boolean;
  /** Uploaded banner photo, e.g. "/uploads/1700000000-rscit.jpg". */
  image?: string | null;
  /** Uploaded brochure/syllabus file students can download. */
  document?: string | null;
};

/**
 * Sample catalogue — used when MongoDB isn't connected, and seeded into the
 * database by `npm run seed`. Once connected, the admin panel is the source of
 * truth and edits appear on the site automatically.
 */
export const COURSES: Course[] = [
  {
    slug: "rscit",
    title: "RSCIT",
    icon: "Award",
    tagline:
      "The official RKCL computer literacy certificate — essential for government jobs.",
    duration: "3 Months",
    batchSize: "Max 20 Students",
    level: "Beginner",
    certification: "RKCL / VMOU Certificate",
    featured: true,
    syllabus: [
      "Computer Fundamentals & Windows",
      "Internet, Email & Digital Payments",
      "MS Office — Word, Excel, PowerPoint",
      "Government e-Services & Digital India",
      "RSCIT Exam Practice & Mock Tests",
    ],
    careers: ["Government Job Eligibility", "Data Entry Operator", "Office Assistant"],
  },
  {
    slug: "basic-computer",
    title: "Basic Computer",
    icon: "Monitor",
    tagline:
      "Build strong digital foundations — from operating systems to office productivity.",
    duration: "2 Months",
    batchSize: "Max 15 Students",
    level: "Beginner",
    certification: "ISO 9001:2015 Certificate",
    syllabus: [
      "Computer Fundamentals & OS Basics",
      "MS Word, Excel & PowerPoint",
      "Internet, Email & Cloud Basics",
      "Typing Mastery & Shortcuts",
      "File Management & Printing",
    ],
    careers: ["Data Entry Operator", "Office Assistant", "Front Office Executive"],
  },
  {
    slug: "advance-computer",
    title: "Advance Computer",
    icon: "Cpu",
    tagline:
      "Level up with advanced Excel, automation and professional office workflows.",
    duration: "3 Months",
    batchSize: "Max 15 Students",
    level: "Intermediate",
    certification: "ISO 9001:2015 Certificate",
    syllabus: [
      "Advanced Excel — Formulas & Pivot Tables",
      "Data Analysis & Dashboards",
      "MS Access & Database Basics",
      "Office Automation & Macros",
      "Business Documentation",
    ],
    careers: ["Office Executive", "MIS Executive", "Back Office Analyst"],
  },
  {
    slug: "tally-gst",
    title: "Tally Prime & GST",
    icon: "Calculator",
    tagline:
      "Become job-ready in accounting with Tally Prime, GST and taxation.",
    duration: "3 Months",
    batchSize: "Max 15 Students",
    level: "Beginner",
    certification: "ISO 9001:2015 Certificate",
    featured: true,
    syllabus: [
      "Accounting Fundamentals",
      "Tally Prime Complete",
      "GST Concepts & Filing",
      "Inventory & Payroll",
      "Income Tax & TDS Basics",
    ],
    careers: ["Accountant", "Accounts Executive", "GST Practitioner"],
  },
  {
    slug: "web-development",
    title: "Web Development",
    icon: "Code2",
    tagline:
      "Go from HTML to full-stack apps with live projects and a real portfolio.",
    duration: "6 Months",
    batchSize: "Max 12 Students",
    level: "Beginner to Advanced",
    certification: "Industry-Recognized Certificate",
    featured: true,
    syllabus: [
      "HTML5, CSS3 & Responsive Design",
      "JavaScript & Modern ES6+",
      "React & Next.js Fundamentals",
      "Backend with Node & Databases",
      "Deployment & Live Projects",
    ],
    careers: ["Frontend Developer", "Full-Stack Developer", "Web Designer"],
  },
  {
    slug: "govt-exam-preparation",
    title: "Govt Exam Preparation",
    icon: "Landmark",
    tagline:
      "Focused computer-section coaching for government and banking exams.",
    duration: "4 Months",
    batchSize: "Max 20 Students",
    level: "All Levels",
    certification: "Institute Certificate",
    featured: true,
    syllabus: [
      "Computer Awareness for Competitive Exams",
      "Typing Speed & Accuracy Practice",
      "Previous Year Papers & Analysis",
      "Weekly Mock Tests & Ranking",
      "Interview & Document Guidance",
    ],
    careers: ["Bank Clerk / PO", "SSC & Railway Posts", "State Govt Departments"],
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    icon: "Megaphone",
    tagline:
      "Master SEO, social media, ads and analytics to grow real brands online.",
    duration: "4 Months",
    batchSize: "Max 15 Students",
    level: "Intermediate",
    certification: "Industry-Recognized Certificate",
    syllabus: [
      "SEO & Keyword Research",
      "Google Ads & Meta Ads",
      "Social Media Marketing",
      "Content & Email Marketing",
      "Google Analytics & Reporting",
    ],
    careers: ["Digital Marketing Executive", "SEO Specialist", "Social Media Manager"],
  },
  {
    slug: "ai-prompt-engineering",
    title: "AI & Prompt Engineering",
    icon: "Sparkles",
    tagline:
      "Work hands-on with modern AI tools and learn to craft high-impact prompts.",
    duration: "2 Months",
    batchSize: "Max 12 Students",
    level: "All Levels",
    certification: "Industry-Recognized Certificate",
    syllabus: [
      "Foundations of AI & LLMs",
      "Prompt Engineering Techniques",
      "AI Tools for Productivity",
      "Content, Image & Code Generation",
      "Building AI-Powered Workflows",
    ],
    careers: ["AI Content Specialist", "Prompt Engineer", "Automation Associate"],
  },
];

export function getCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

/**
 * Cards that auto-rotate in the hero. `seats` drives the progress bar.
 * Slugs must match a course so the card can link through.
 */
export const HERO_SLIDES = [
  { slug: "rscit", title: "RSCIT", subtitle: "RKCL Certified · Govt Approved", seats: 85, duration: "3 Months", tag: "Most Popular" },
  { slug: "tally-gst", title: "Tally Prime & GST", subtitle: "Accounting · Taxation", seats: 70, duration: "3 Months", tag: "Job Oriented" },
  { slug: "web-development", title: "Full-Stack Web Development", subtitle: "Live Projects · Portfolio", seats: 80, duration: "6 Months", tag: "Live Batch" },
  { slug: "govt-exam-preparation", title: "Govt Exam Preparation", subtitle: "Bank · SSC · Railway", seats: 65, duration: "4 Months", tag: "New Batch" },
] as const;

export const STATS = [
  { value: "1000+", label: "Students Trained" },
  { value: "15+", label: "Hiring Partners" },
  { value: "100%", label: "Placement Support" },
  { value: "4.9★", label: "Google Rating" },
];

export const WHY_US = [
  {
    title: "Experienced Corporate Trainers",
    description:
      "Learn from mentors with real-world IT and industry experience who teach what employers actually expect.",
  },
  {
    title: "Hands-on Practical Labs",
    description:
      "Every student gets a dedicated workstation. 100% lab-oriented classes mean you learn by doing, not just watching.",
  },
  {
    title: "ISO Certified Quality",
    description:
      "As an ISO 9001:2015 certified institute, our globally valid certifications add real weight to your résumé.",
  },
];

export const BENEFITS = [
  "Free Study Materials",
  "Live Projects",
  "Weekly Mock Tests",
  "Placement Workshops",
  "Lifetime Doubt Clearing",
  "1-on-1 Personal Mentorship",
  "100% Lab-Oriented Classes",
  "Industry-Recognized Certificate",
];

export const CONTACT = {
  phone: "+91 89492 24095",
  phoneHref: "tel:+918949224095",
  whatsapp: "https://wa.me/918949224095",
  email: "info@navyacomputech.com",
  address: "Navya Computech Tower, 2nd Floor, Main Tech Park Area, India",
};

export const NAV_LINKS = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/about" },
  { label: "Courses", href: "/#courses" },
  { label: "Why Us", href: "/#why-us" },
  { label: "Admissions", href: "/#admissions" },
  { label: "Contact", href: "/#contact" },
];

export const FAQS = [
  {
    q: "Do I need any prior computer knowledge to join?",
    a: "No. Our RSCIT and Basic Computer tracks start from absolute zero, and every other course begins with a foundations module. Our counselors will help you pick the right starting point in a free demo session.",
  },
  {
    q: "How do I find out the course fees?",
    a: "Fees vary by course and batch, so we share them personally. Call or WhatsApp us at +91 89492 24095, email info@navyacomputech.com, or visit the institute — our counselors will explain the current fee structure and installment options with no hidden charges.",
  },
  {
    q: "What are the batch timings?",
    a: "We run morning, afternoon and evening batches six days a week, including special weekend batches for working professionals and college students. You can switch batches with prior notice.",
  },
  {
    q: "Is the certificate valid for jobs and higher studies?",
    a: "Yes. Our RSCIT certification is issued by RKCL/VMOU and is required for many government posts. As an ISO 9001:2015 certified institute, our other certificates are recognized by employers across India.",
  },
  {
    q: "Do you really provide placement support?",
    a: "Yes — 100% placement support is included with every course. That covers resume building, weekly mock interviews, placement workshops and referrals to our 15+ hiring partners. We support you until you're placed.",
  },
  {
    q: "Can I attend a free demo class before enrolling?",
    a: "Absolutely. Call or WhatsApp us and we'll schedule a free demo class plus a one-on-one counseling session — no obligation to enroll.",
  },
  {
    q: "Are classes practical or theory-based?",
    a: "100% lab-oriented. Every student gets a dedicated workstation, and every concept is taught by doing — with live projects in the advanced tracks.",
  },
  {
    q: "What if I miss a class?",
    a: "You can attend the same topic in a parallel batch, and our lifetime doubt-clearing support means trainers are always available to help you catch up.",
  },
];
