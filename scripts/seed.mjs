/**
 * Seeds MongoDB with the starter course catalogue and creates helpful indexes.
 * Works with a local MongoDB (browsable in MongoDB Compass) or Atlas — it just
 * uses whatever MONGODB_URI points at.
 *
 *   npm run seed
 *
 * Safe to re-run: courses are upserted by slug, so nothing is duplicated.
 */
import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Minimal .env loader so the script works without extra dependencies.
function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    try {
      const raw = readFileSync(join(__dirname, "..", file), "utf8");
      for (const line of raw.split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (m && !process.env[m[1]]) {
          process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
        }
      }
    } catch {
      // file missing — fine
    }
  }
}

loadEnv();

const URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || "navya_computech";

if (!URI) {
  console.error("\n✖ MONGODB_URI is not set. Add it to .env first.\n");
  process.exit(1);
}

const COURSES = [
  {
    slug: "rscit",
    title: "RSCIT",
    icon: "Award",
    tagline: "The official RKCL computer literacy certificate — essential for government jobs.",
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
    sortOrder: 1,
  },
  {
    slug: "basic-computer",
    title: "Basic Computer",
    icon: "Monitor",
    tagline: "Build strong digital foundations — from operating systems to office productivity.",
    duration: "2 Months",
    batchSize: "Max 15 Students",
    level: "Beginner",
    certification: "ISO 9001:2015 Certificate",
    featured: false,
    syllabus: [
      "Computer Fundamentals & OS Basics",
      "MS Word, Excel & PowerPoint",
      "Internet, Email & Cloud Basics",
      "Typing Mastery & Shortcuts",
      "File Management & Printing",
    ],
    careers: ["Data Entry Operator", "Office Assistant", "Front Office Executive"],
    sortOrder: 2,
  },
  {
    slug: "advance-computer",
    title: "Advance Computer",
    icon: "Cpu",
    tagline: "Level up with advanced Excel, automation and professional office workflows.",
    duration: "3 Months",
    batchSize: "Max 15 Students",
    level: "Intermediate",
    certification: "ISO 9001:2015 Certificate",
    featured: false,
    syllabus: [
      "Advanced Excel — Formulas & Pivot Tables",
      "Data Analysis & Dashboards",
      "MS Access & Database Basics",
      "Office Automation & Macros",
      "Business Documentation",
    ],
    careers: ["Office Executive", "MIS Executive", "Back Office Analyst"],
    sortOrder: 3,
  },
  {
    slug: "tally-gst",
    title: "Tally Prime & GST",
    icon: "Calculator",
    tagline: "Become job-ready in accounting with Tally Prime, GST and taxation.",
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
    sortOrder: 4,
  },
  {
    slug: "web-development",
    title: "Web Development",
    icon: "Code2",
    tagline: "Go from HTML to full-stack apps with live projects and a real portfolio.",
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
    sortOrder: 5,
  },
  {
    slug: "govt-exam-preparation",
    title: "Govt Exam Preparation",
    icon: "Landmark",
    tagline: "Focused computer-section coaching for government and banking exams.",
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
    sortOrder: 6,
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    icon: "Megaphone",
    tagline: "Master SEO, social media, ads and analytics to grow real brands online.",
    duration: "4 Months",
    batchSize: "Max 15 Students",
    level: "Intermediate",
    certification: "Industry-Recognized Certificate",
    featured: false,
    syllabus: [
      "SEO & Keyword Research",
      "Google Ads & Meta Ads",
      "Social Media Marketing",
      "Content & Email Marketing",
      "Google Analytics & Reporting",
    ],
    careers: ["Digital Marketing Executive", "SEO Specialist", "Social Media Manager"],
    sortOrder: 7,
  },
  {
    slug: "ai-prompt-engineering",
    title: "AI & Prompt Engineering",
    icon: "Sparkles",
    tagline: "Work hands-on with modern AI tools and learn to craft high-impact prompts.",
    duration: "2 Months",
    batchSize: "Max 12 Students",
    level: "All Levels",
    certification: "Industry-Recognized Certificate",
    featured: false,
    syllabus: [
      "Foundations of AI & LLMs",
      "Prompt Engineering Techniques",
      "AI Tools for Productivity",
      "Content, Image & Code Generation",
      "Building AI-Powered Workflows",
    ],
    careers: ["AI Content Specialist", "Prompt Engineer", "Automation Associate"],
    sortOrder: 8,
  },
];

const client = new MongoClient(URI);

try {
  await client.connect();
  const db = client.db(DB_NAME);
  console.log(`\n→ Connected to database "${DB_NAME}"`);

  // Courses — upsert by slug so re-running never duplicates.
  let created = 0;
  for (const course of COURSES) {
    const res = await db.collection("courses").updateOne(
      { slug: course.slug },
      {
        $set: { ...course, isActive: true, updatedAt: new Date() },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true },
    );
    if (res.upsertedCount) created++;
  }
  console.log(`✔ Courses: ${COURSES.length} upserted (${created} new)`);

  // Indexes
  await db.collection("courses").createIndex({ slug: 1 }, { unique: true });
  await db.collection("courses").createIndex({ isActive: 1, sortOrder: 1 });
  await db.collection("inquiries").createIndex({ createdAt: -1 });
  await db.collection("inquiries").createIndex({ status: 1 });
  await db.collection("activity").createIndex({ createdAt: -1 });
  console.log("✔ Indexes created");

  console.log(
    `\n✅ Seed complete. Open Compass and connect to "${URI.split("@").pop()}" to browse the "${DB_NAME}" database.`,
  );
  console.log("   Then start the app and open /admin\n");
} catch (err) {
  console.error("\n✖ Seed failed:", err.message);

  if (/querySrv|ECONNREFUSED _mongodb|ENOTFOUND _mongodb/i.test(err.message)) {
    // The SRV *DNS lookup* failed — nothing to do with credentials or Atlas.
    console.error(
      "\n  This is a DNS problem, not a password or Network Access problem.\n" +
        "  Node resolves 'mongodb+srv://' via c-ares (direct UDP to your DNS\n" +
        "  server), and that path is blocked/refused on this network.\n\n" +
        "  Fix: use Atlas's STANDARD (non-SRV) connection string instead —\n" +
        "  Atlas → Connect → Drivers → pick Node driver '2.2.12 or later'.\n" +
        "  It looks like: mongodb://user:pass@host-00:27017,host-01:27017,...\n" +
        "     /?ssl=true&replicaSet=...&authSource=admin\n",
    );
  } else if (/Authentication failed|bad auth/i.test(err.message)) {
    console.error(
      "\n  Wrong username or password in MONGODB_URI. Check the value between\n" +
        "  ':' and '@'. If the password has @ : / ? # or %, URL-encode it.\n",
    );
  } else if (/ETIMEDOUT|ServerSelection|timed out/i.test(err.message)) {
    console.error(
      "\n  Couldn't reach the server. Check that:\n" +
        "   • For Atlas: your IP is allowed under Network Access (0.0.0.0/0).\n" +
        "   • For local: the 'MongoDB' Windows service is running (services.msc).\n",
    );
  }
  process.exitCode = 1;
} finally {
  await client.close();
}
