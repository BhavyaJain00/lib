import { CONTACT, FAQS, STATS, WHY_US, type Course } from "@/lib/data";

/**
 * Rule-based answer engine for the site chatbot. Runs fully in the browser —
 * no API keys, no external AI service, no cost. It answers from the same data
 * the site renders (courses, FAQs, contact info), so replies always match
 * what's on the page. Course data is passed in (not imported) so the widget
 * can receive the live catalogue from Supabase instead of the static samples.
 */

export type BotLink = { label: string; href: string };

export type BotReply = {
  /** Plain text with \n line breaks, "• " bullets and **bold** markers. */
  text: string;
  /** Optional action buttons rendered under the message. */
  links?: BotLink[];
  /** Course the reply was about — remembered for follow-up questions. */
  courseSlug?: string;
};

/** Rolling context so "how long is it?" works after asking about a course. */
export type BotContext = { lastCourseSlug?: string };

const CONTACT_LINKS: BotLink[] = [
  { label: "📞 Call us", href: CONTACT.phoneHref },
  { label: "💬 WhatsApp", href: CONTACT.whatsapp },
];

/* ------------------------------ Text helpers ------------------------------ */

function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** True when any keyword appears as a whole word/phrase in the text. */
function has(text: string, ...keywords: string[]): boolean {
  return keywords.some((kw) =>
    new RegExp(`\\b${kw.replace(/\s+/g, "\\s+")}\\b`).test(text),
  );
}

const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "am", "do", "does", "did", "can", "could",
  "will", "would", "should", "i", "you", "we", "my", "your", "me", "us",
  "to", "of", "in", "on", "at", "for", "and", "or", "it", "this", "that",
  "what", "which", "how", "please", "tell", "about", "want", "need", "know",
  "hai", "ka", "ki", "ke", "kya", "me", "mein", "h",
]);

function tokens(text: string): string[] {
  return normalize(text)
    .split(" ")
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

/* ----------------------------- Course matching ----------------------------- */

/**
 * Extra ways students refer to the starter courses. Courses added later via
 * the admin panel still match by their title and slug words.
 */
const COURSE_ALIASES: Record<string, string[]> = {
  rscit: ["rscit", "rs cit", "rkcl", "vmou", "computer literacy"],
  "basic-computer": ["basic computer", "computer basics", "basic course"],
  "advance-computer": [
    "advance computer", "advanced computer", "advanced excel", "excel",
    "pivot", "macros", "mis",
  ],
  "tally-gst": ["tally", "gst", "accounting", "accounts", "taxation", "tax"],
  "web-development": [
    "web development", "web dev", "website", "web designing", "full stack",
    "coding", "programming", "html", "css", "javascript", "react", "developer",
  ],
  "govt-exam-preparation": [
    "govt exam", "government exam", "government job", "govt job", "sarkari",
    "bank exam", "ssc", "railway", "typing", "competitive exam", "mock test",
  ],
  "digital-marketing": [
    "digital marketing", "marketing", "seo", "social media", "google ads",
    "instagram", "youtube",
  ],
  "ai-prompt-engineering": [
    "ai", "artificial intelligence", "prompt", "chatgpt", "ai tools",
  ],
};

/** Best-matching course for the question, preferring longer (more specific) matches. */
function findCourse(text: string, courses: Course[]): Course | undefined {
  let best: Course | undefined;
  let bestLen = 0;
  for (const course of courses) {
    const phrases = [
      normalize(course.title),
      course.slug.replace(/-/g, " "),
      ...(COURSE_ALIASES[course.slug] ?? []),
    ];
    for (const phrase of phrases) {
      if (phrase && has(text, phrase) && phrase.length > bestLen) {
        best = course;
        bestLen = phrase.length;
      }
    }
  }
  return best;
}

/* ----------------------------- Reply builders ------------------------------ */

function courseCard(c: Course): BotReply {
  const lines = [
    `**${c.title}** — ${c.tagline}`,
    "",
    `• Duration: ${c.duration}`,
    `• Level: ${c.level}`,
    `• Batch: ${c.batchSize}`,
    `• Certificate: ${c.certification}`,
  ];
  if (c.syllabus.length) {
    lines.push("", "**What you'll learn:**", ...c.syllabus.map((s) => `• ${s}`));
  }
  if (c.careers.length) {
    lines.push("", `**Career paths:** ${c.careers.join(", ")}`);
  }
  return {
    text: lines.join("\n"),
    links: [
      { label: "📖 View full course", href: `/courses/${c.slug}` },
      { label: "🎓 Book free demo", href: CONTACT.whatsapp },
    ],
    courseSlug: c.slug,
  };
}

function courseList(courses: Course[]): BotReply {
  return {
    text: [
      `We offer **${courses.length} courses**:`,
      "",
      ...courses.map((c) => `• **${c.title}** — ${c.duration} · ${c.level}`),
      "",
      "Ask me about any of them — e.g. *\"Tell me about RSCIT\"*.",
    ].join("\n"),
    links: [{ label: "📚 Browse all courses", href: "/#courses" }],
  };
}

function feesReply(course?: Course): BotReply {
  const about = course ? ` for **${course.title}**` : "";
  return {
    text:
      `Fees${about} vary by course and batch, so we share them personally — ` +
      `with no hidden charges and easy installment options.\n\n` +
      `Call or WhatsApp **${CONTACT.phone}** and our counselors will explain ` +
      `the current fee structure and any ongoing offers.`,
    links: CONTACT_LINKS,
    courseSlug: course?.slug,
  };
}

function fallbackReply(): BotReply {
  return {
    text: [
      "I am the **Navya Computech AI Assistant** 🤖",
      "",
      "I am specifically trained to answer questions about **Navya Computech** and our courses.",
      "",
      "You can ask me about:",
      "• 📚 Our **courses** (RSCIT, Tally Prime, Web Dev, Govt Exam, AI Prompting…)",
      "• 💰 **Course fees** & flexible installments",
      "• 🕐 **Batch timings** (Morning, Evening, Weekend)",
      "• 🎓 **Admissions** & booking a free demo class",
      "• 💼 **Placement** support & hiring partners",
      "• 📍 **Location** & contact numbers",
    ].join("\n"),
    links: CONTACT_LINKS,
  };
}

/* ------------------------------ Main answerer ------------------------------ */

export function answer(
  question: string,
  courses: Course[],
  ctx: BotContext = {},
): BotReply {
  const text = normalize(question);
  if (!text) return fallbackReply();

  const mentioned = findCourse(text, courses);
  // Follow-up questions ("how long is it?") fall back to the last course.
  const course =
    mentioned ?? courses.find((c) => c.slug === ctx.lastCourseSlug);

  /* --- Small talk ---------------------------------------------------------- */

  if (
    has(text, "hi", "hii", "hiii", "hello", "hey", "namaste", "namaskar", "good morning", "good afternoon", "good evening") &&
    text.split(" ").length <= 4
  ) {
    return {
      text:
        `Hello! 👋 Welcome to **Navya Computech** — an ISO 9001:2015 certified ` +
        `computer training institute.\n\nAsk me anything about our courses, ` +
        `fees, batch timings, admissions or placements.`,
    };
  }

  if (has(text, "thank", "thanks", "thankyou", "dhanyavad", "shukriya")) {
    return {
      text:
        "You're most welcome! 😊 If you have more questions about Navya Computech, I'm right here — " +
        `or call us anytime at **${CONTACT.phone}**.`,
    };
  }

  if (has(text, "bye", "goodbye", "see you", "ok bye")) {
    return {
      text:
        "Goodbye! 👋 Hope to see you at Navya Computech soon. " +
        "Your free demo class is always waiting!",
    };
  }

  /* --- Money & timings (checked before course cards so "rscit fees" works) -- */

  if (has(text, "fee", "fees", "price", "cost", "charge", "charges", "amount", "kitna", "kitni", "paisa", "rupees", "installment", "emi", "discount", "offer")) {
    return feesReply(course);
  }

  if (has(text, "timing", "timings", "time", "schedule", "shift", "morning", "evening", "afternoon", "weekend", "sunday", "kab", "samay")) {
    return {
      text:
        "🕐 We run **morning, afternoon and evening batches** six days a week, " +
        "plus **special weekend batches** for working professionals and college " +
        "students.\n\nYou can also switch batches later with prior notice. " +
        "Call us to find a batch that fits your routine.",
      links: CONTACT_LINKS,
    };
  }

  /* --- Course-specific questions ------------------------------------------- */

  if (course) {
    if (has(text, "duration", "how long", "months", "month", "kitne din", "mahine")) {
      return {
        text: `**${course.title}** runs for **${course.duration}** (${course.level} level, ${course.batchSize.toLowerCase()}).`,
        links: [{ label: "📖 View course", href: `/courses/${course.slug}` }],
        courseSlug: course.slug,
      };
    }
    if (has(text, "syllabus", "curriculum", "topics", "content", "modules", "learn", "covered", "teach")) {
      return {
        text: [
          `**${course.title} — syllabus:**`,
          "",
          ...course.syllabus.map((s) => `• ${s}`),
        ].join("\n"),
        links: [{ label: "📖 View full course", href: `/courses/${course.slug}` }],
        courseSlug: course.slug,
      };
    }
    if (has(text, "career", "careers", "job", "jobs", "scope", "salary", "naukri", "future", "after")) {
      return {
        text:
          `After **${course.title}** you can work as: ` +
          `**${course.careers.join(", ")}**.\n\nEvery course includes 100% ` +
          `placement support — resume building, mock interviews and referrals ` +
          `to our 15+ hiring partners.`,
        links: [{ label: "📖 View course", href: `/courses/${course.slug}` }],
        courseSlug: course.slug,
      };
    }
    if (has(text, "certificate", "certification", "certified", "valid")) {
      return {
        text:
          `**${course.title}** awards a **${course.certification}**. ` +
          `As an ISO 9001:2015 certified institute, our certificates are ` +
          `recognized by employers across India.`,
        courseSlug: course.slug,
      };
    }
    // Course mentioned without a specific attribute → full course card.
    return courseCard(course);
  }

  /* --- General topics -------------------------------------------------------- */

  if (has(text, "course", "courses", "program", "programs", "classes", "what do you teach", "options", "list")) {
    return courseList(courses);
  }

  if (has(text, "demo", "trial", "free class", "sample class")) {
    return {
      text:
        "🎓 Yes! You can attend a **free demo class** before enrolling — sit in " +
        "a live class, see the labs and meet the trainers, with no obligation " +
        "to join.\n\nCall or WhatsApp us and we'll schedule it along with a " +
        "free one-on-one counseling session.",
      links: CONTACT_LINKS,
    };
  }

  if (has(text, "admission", "admissions", "join", "enroll", "enrol", "register", "apply", "start")) {
    return {
      text: [
        "**Joining is simple — 3 steps:**",
        "",
        "• **1. Call or WhatsApp us** — tell us which course interests you.",
        "• **2. Attend a free demo class** — visit, sit in a live class, see the labs.",
        "• **3. Join your batch** — pick a timing that suits you and start learning.",
        "",
        "No online payments on this website — everything is personal and guided.",
      ].join("\n"),
      links: [...CONTACT_LINKS, { label: "📝 Send an inquiry", href: "/#admissions" }],
    };
  }

  if (has(text, "placement", "placements", "job", "jobs", "naukri", "hiring", "interview", "resume", "salary")) {
    return {
      text:
        "💼 **100% placement support** is included with every course:\n\n" +
        "• Resume building & placement workshops\n" +
        "• Weekly mock interviews\n" +
        "• Referrals to our **15+ hiring partners**\n\n" +
        "We support you until you're placed — 1000+ students trained so far.",
      links: [{ label: "📚 See courses", href: "/#courses" }],
    };
  }

  if (has(text, "certificate", "certification", "certified", "iso", "valid", "recognized")) {
    return {
      text:
        "🏆 Yes — our certificates are valid for jobs and higher studies. " +
        "**RSCIT** is issued by RKCL/VMOU and is required for many government " +
        "posts. As an **ISO 9001:2015 certified institute**, our other " +
        "certificates are recognized by employers across India.",
    };
  }

  if (has(text, "address", "location", "located", "where", "visit", "directions", "kaha", "reach")) {
    return {
      text:
        `📍 **${CONTACT.address}**\n\nWalk-ins are welcome! Come visit the ` +
        `labs and attend a free demo class. Call us first and we'll have a ` +
        `counselor ready for you.`,
      links: CONTACT_LINKS,
    };
  }

  if (has(text, "contact", "phone", "number", "call", "whatsapp", "email", "mail", "talk", "counselor", "human", "person")) {
    return {
      text: [
        "Here's how to reach us:",
        "",
        `• 📞 Phone: **${CONTACT.phone}**`,
        `• 💬 WhatsApp: same number, anytime`,
        `• ✉️ Email: **${CONTACT.email}**`,
        `• 📍 ${CONTACT.address}`,
      ].join("\n"),
      links: [...CONTACT_LINKS, { label: "✉️ Email us", href: `mailto:${CONTACT.email}` }],
    };
  }

  if (has(text, "about", "institute", "navya", "who are you", "why", "best", "facility", "facilities", "lab", "labs", "trainer", "trainers")) {
    return {
      text: [
        "**Navya Computech** — an ISO 9001:2015 certified computer training institute.",
        "",
        ...STATS.map((s) => `• **${s.value}** ${s.label}`),
        "",
        ...WHY_US.map((w) => `• **${w.title}** — ${w.description}`),
      ].join("\n"),
      links: [{ label: "ℹ️ About us", href: "/about" }],
    };
  }

  /* --- FAQ fuzzy match — catches anything phrased like a listed FAQ --------- */

  const qTokens = new Set(tokens(question));
  let bestFaq: (typeof FAQS)[number] | undefined;
  let bestScore = 0;
  for (const faq of FAQS) {
    const score = tokens(faq.q).filter((t) => qTokens.has(t)).length;
    if (score > bestScore) {
      bestFaq = faq;
      bestScore = score;
    }
  }
  if (bestFaq && bestScore >= 2) {
    return { text: bestFaq.a, links: CONTACT_LINKS };
  }

  return fallbackReply();
}

/**
 * Builds a comprehensive System Prompt with Navya Computech institute knowledge
 * for LLM models (Gemini / OpenAI).
 */
export function buildSystemPrompt(courses: Course[]): string {
  const courseListText = courses
    .map(
      (c) =>
        `- Title: ${c.title} (Slug: ${c.slug})\n` +
        `  Tagline: ${c.tagline}\n` +
        `  Duration: ${c.duration} | Level: ${c.level} | Batch: ${c.batchSize}\n` +
        `  Certification: ${c.certification}\n` +
        `  Syllabus: ${c.syllabus.join(", ")}\n` +
        `  Career Options: ${c.careers.join(", ")}`
    )
    .join("\n\n");

  const faqText = FAQS.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n");

  return `You are the official AI Assistant for Navya Computech — an ISO 9001:2015 certified computer training institute.

STRICT SCOPE BOUNDARY:
- You are strictly limited to answering questions related ONLY to Navya Computech institute, its courses, admissions, fees, timings, syllabus, certifications, placement support, facilities, and contact details.
- If the user asks ANY question unrelated to Navya Computech (such as general news, sports, coding assignments, recipes, math, general science, or other off-topic subjects), you MUST politely refuse and state:
  "I am the Navya Computech AI Assistant. I can only assist with questions about Navya Computech institute, our courses, fees, batch timings, admissions, and placement support."

INSTITUTE SUMMARY:
- Name: Navya Computech & Navya Library
- Certification: ISO 9001:2015 Certified
- Established: 2018 (Over 1000+ students trained, 15+ hiring partners, 100% placement support, 4.9★ Google rating)
- Phone/WhatsApp: ${CONTACT.phone} (${CONTACT.whatsapp})
- Email: ${CONTACT.email}
- Address: ${CONTACT.address}

NAVYA LIBRARY SUB-CENTER:
- Quiet self-study sanctuary & AC reading halls for competitive exam preparation.
- Features: 500 Mbps Wi-Fi, personal charging sockets at every desk, ergonomic chairs, 24/7 CCTV, RO water, newspapers & magazines.
- Shift Plans: Morning (₹799/mo), Evening (₹799/mo), Full Day (₹1,399/mo), 24/7 Unlimited (₹1,799/mo).
- Location: Accessible at /library page on this site.

KEY HIGHLIGHTS & ADVANTAGES:
- 100% lab-oriented classes with dedicated workstation for every student.
- Experienced corporate trainers with real IT industry experience.
- Free study materials & lifetime doubt-clearing support.
- Free Demo Class available before enrolling (no obligation).
- Morning, afternoon, evening, and weekend batches available.

COURSES OFFERED:
${courseListText}


FREQUENTLY ASKED QUESTIONS:
${faqText}

INSTRUCTIONS:
1. Always be polite, encouraging, clear, and professional.
2. Keep answers concise, easy to read, with bullet points (•) and bold text (**bold**) where appropriate.
3. If asked about fees, explain that fees vary by batch and installment plan, so students are encouraged to call or WhatsApp ${CONTACT.phone} for exact fee structures and discounts.
4. Encourage booking a free demo class or contacting counselors when appropriate.
5. Answer strictly based on Navya Computech facts and general computer education context at this institute.`;
}

/**
 * Builds system prompt for Navya Library AI Assistant mode.
 */
export function buildLibrarySystemPrompt(): string {
  return `You are the official AI Assistant for Navya Library 📚 — an ISO 9001:2015 certified quiet self-study sanctuary & AC reading hall.
Your primary role is to help students, CA/UPSC/SSC aspirants, and self-studying individuals with accurate information about Navya Library shifts, fees, amenities, seat reservations, and location.

NAVYA LIBRARY DETAILS:
- Name: Navya Library
- Address: Main Tech Park Area, Jaipur, Rajasthan
- Phone/WhatsApp: ${CONTACT.phone} (${CONTACT.whatsapp})
- Email: ${CONTACT.email}

SHIFTS & MONTHLY MEMBERSHIP FEES:
1. Morning Shift (6:00 AM – 2:00 PM, 8 Hours) — ₹799 per month
2. Evening Shift (2:00 PM – 10:00 PM, 8 Hours) — ₹799 per month
3. Full Day Shift (6:00 AM – 10:00 PM, 16 Hours) — ₹1,399 per month (Most Popular)
4. 24/7 Unlimited Access (Round-the-Clock Keycard Access) — ₹1,799 per month

AMENITIES & FACILITIES:
- Full AC quiet reading halls with noise-cancelling desk partitions.
- Personal electrical sockets & LED desk lights at every individual booth.
- Unlimited 500 Mbps high-speed optical fiber Wi-Fi.
- 24/7 CCTV camera security and personal locker storage.
- RO drinking water dispenser & tea/coffee break lounge.
- Daily Hindi & English national newspapers, Monthly Current Affairs, and competitive magazines.
- Free 1-Day Trial Visit available before joining.

INSTRUCTIONS:
1. Be polite, encouraging, clear, and professional.
2. Answer queries specifically focused on Navya Library study halls, shift timings, monthly fees, amenities, seat bookings, and location.
3. Keep formatting clean with bullet points (•) and bold text (**bold**).`;
}

/**
 * Smart rule-based answer engine for Navya Library mode.
 */
export function answerLibrary(question: string, ctx: BotContext = {}): BotReply {
  const text = normalize(question);
  if (!text) {
    return {
      text: [
        "Welcome to **Navya Library** 📚 — your quiet AC study sanctuary!",
        "",
        "I can answer any questions about:",
        "• 🕐 **Shift Timings** (Morning, Evening, Full Day, 24/7)",
        "• 💰 **Monthly Membership Fees** (Starting ₹799/mo)",
        "• ⚡ **Amenities** (500 Mbps Wi-Fi, AC, Power ports)",
        "• 🎓 **Free 1-Day Trial Seat**",
        "• 📍 **Location & Directions**",
      ].join("\n"),
      links: [
        { label: "📝 Reserve Seat", href: "/library#reserve" },
        { label: "💬 WhatsApp Us", href: CONTACT.whatsapp },
      ],
    };
  }

  if (has(text, "fee", "fees", "price", "cost", "charge", "amount", "rupees", "kitna", "paisa", "plan", "plans", "rate")) {
    return {
      text: [
        "**Navya Library Shift Membership Fees:**",
        "",
        "• **Morning Shift** (6 AM - 2 PM): **₹799 / month**",
        "• **Evening Shift** (2 PM - 10 PM): **₹799 / month**",
        "• **Full Day Shift** (6 AM - 10 PM): **₹1,399 / month** *(Most Popular)*",
        "• **24/7 Unlimited Access**: **₹1,799 / month** *(Includes Free Locker)*",
        "",
        "No advance booking fee! You can also book a free 1-day trial visit.",
      ].join("\n"),
      links: [
        { label: "📝 Reserve Shift", href: "/library#reserve" },
        { label: "💬 WhatsApp Us", href: CONTACT.whatsapp },
      ],
    };
  }

  if (has(text, "timing", "timings", "time", "shift", "shifts", "hour", "hours", "morning", "evening", "night", "24/7", "kab")) {
    return {
      text: [
        "**Navya Library Shift Options:**",
        "",
        "• 🌅 **Morning Shift**: 6:00 AM – 2:00 PM (8 Hours)",
        "• 🌇 **Evening Shift**: 2:00 PM – 10:00 PM (8 Hours)",
        "• ☀️ **Full Day Shift**: 6:00 AM – 10:00 PM (16 Hours)",
        "• 🌙 **24/7 Unlimited**: Round the clock 24-hour keycard access",
      ].join("\n"),
      links: [{ label: "📝 Reserve Seat", href: "/library#reserve" }],
    };
  }

  if (has(text, "facility", "facilities", "amenity", "amenities", "wifi", "ac", "air condition", "power", "socket", "water", "locker", "newspaper")) {
    return {
      text: [
        "**Navya Library Premium Amenities:**",
        "",
        "• ❄️ **Full AC Silent Reading Halls** with dust-free air",
        "• ⚡ **Personal Power Sockets** & LED desk lights at every booth",
        "• 📶 **500 Mbps High-Speed Wi-Fi** for lectures & test series",
        "• 🚰 **Clean RO Drinking Water** & Tea/Coffee break lounge",
        "• 📹 **24/7 CCTV Security** & personal locker storage",
        "• 📰 **Daily Newspapers & Competitive Magazines**",
      ].join("\n"),
      links: [{ label: "📝 Book Trial Seat", href: "/library#reserve" }],
    };
  }

  if (has(text, "book", "reserve", "trial", "seat", "join", "admission", "register")) {
    return {
      text: [
        "🎓 You can reserve a seat or book a **Free 1-Day Trial Visit** at Navya Library!",
        "",
        "Fill the simple online reservation form at `/library#reserve` or call/WhatsApp us directly at **" + CONTACT.phone + "**.",
      ].join("\n"),
      links: [
        { label: "📝 Reserve Seat Now", href: "/library#reserve" },
        { label: "💬 WhatsApp Us", href: CONTACT.whatsapp },
      ],
    };
  }

  if (has(text, "location", "address", "where", "kaha", "map", "directions")) {
    return {
      text:
        `📍 **Navya Library Address:**\nNavya Library Tower, Main Tech Park Area, Jaipur, Rajasthan.\n\n` +
        `We are easily accessible with vehicle parking. Call us at **${CONTACT.phone}** for turn-by-turn directions.`,
      links: [
        { label: "📍 View Google Maps", href: "https://www.google.com/maps/search/navya+library/@26.8747182,75.671413,12429m" },
        { label: "📞 Call Us", href: CONTACT.phoneHref },
      ],
    };
  }

  return {
    text: [
      "I am the **Navya Library AI Assistant** 📚",
      "",
      "I can answer questions about:",
      "• 🕐 **Shift Timings** (Morning, Evening, Full Day, 24/7)",
      "• 💰 **Monthly Membership Fees** (Starting ₹799/mo)",
      "• ⚡ **Amenities** (500 Mbps Wi-Fi, AC, Power sockets)",
      "• 🎓 **Free 1-Day Trial Seat**",
      "• 📍 **Location & Google Maps**",
    ].join("\n"),
    links: [
      { label: "📝 Reserve Seat", href: "/library#reserve" },
      { label: "💬 WhatsApp Us", href: CONTACT.whatsapp },
    ],
  };
}



