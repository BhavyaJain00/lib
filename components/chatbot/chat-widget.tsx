"use client";

import * as React from "react";
import Link from "next/link";
import { Bot, Send, Sparkles, X, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react";
import { answer, answerLibrary, type BotLink, type BotReply } from "@/lib/chatbot";

import type { Course } from "@/lib/data";
import { cn } from "@/lib/utils";

import { DraggableFab } from "@/components/ui/draggable-fab";

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
  links?: BotLink[];
  score?: 1 | -1;
};

const WELCOME_COMPUTECH: Message = {
  id: "welcome-1",
  role: "bot",
  text:
    "Hi! 👋 I'm the **Navya Computech AI assistant**.\n\nAsk me anything about " +
    "our courses, fees, batch timings, admissions or placements.",
};

const WELCOME_LIBRARY: Message = {
  id: "welcome-lib-1",
  role: "bot",
  text:
    "Welcome to **Navya Library** 📚 — your quiet AC study sanctuary!\n\nAsk me anything about " +
    "our AC reading halls, shift timings (Morning, Evening, Full Day, 24/7), monthly fees, amenities, or booking a free 1-day trial seat.",
};

const QUICK_REPLIES_COMPUTECH = [
  "📚 All courses",
  "💰 Course fees",
  "🕐 Batch timings",
  "🎓 How to join?",
  "🧪 Free demo class",
  "📞 Contact us",
];

const QUICK_REPLIES_LIBRARY = [
  "🕐 Shift Timings",
  "💰 Monthly Fees",
  "🧪 Free 1-Day Trial",
  "⚡ Amenities (Wi-Fi/AC)",
  "📍 Location & Map",
  "📝 Reserve a Seat",
];

const LOCAL_STORAGE_KEY_COMPUTECH = "navya_chat_history_v1";
const LOCAL_STORAGE_KEY_LIBRARY = "navya_library_chat_history_v1";


/** Renders **bold** spans inside a line of bot text. */
function FormattedLine({ line }: { line: string }) {
  const parts = line.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold">
            {part}
          </strong>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}

function MessageBubble({
  message,
  onScore,
  prevQuestion,
}: {
  message: Message;
  onScore?: (id: string, score: 1 | -1, prevQuestion?: string, text?: string) => void;
  prevQuestion?: string;
}) {
  const isBot = message.role === "bot";
  const [rating, setRating] = React.useState<1 | -1 | undefined>(message.score);

  React.useEffect(() => {
    setRating(message.score);
  }, [message.score]);

  function handleRate(score: 1 | -1) {
    const newScore = rating === score ? undefined : score;
    setRating(newScore);
    if (newScore && onScore) {
      onScore(message.id, newScore, prevQuestion, message.text);
    }
  }

  return (
    <div className={cn("flex flex-col", isBot ? "items-start" : "items-end")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
          isBot
            ? "rounded-bl-sm border border-border bg-card text-card-foreground"
            : "rounded-br-sm bg-primary text-primary-foreground",
        )}
      >
        {message.text.split("\n").map((line, i) =>
          line === "" ? (
            <div key={i} className="h-2" />
          ) : (
            <p key={i} className={line.startsWith("• ") ? "pl-1" : undefined}>
              <FormattedLine line={line} />
            </p>
          ),
        )}
        {message.links && message.links.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {message.links.map((link) => {
              const internal = link.href.startsWith("/");
              const className =
                "inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10";
              return internal ? (
                <Link key={link.href + link.label} href={link.href} className={className}>
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href + link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className={className}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Response Rating / Score Buttons for previous bot talks */}
      {isBot && message.id !== "welcome-1" && (
        <div className="mt-1 flex items-center gap-1.5 px-1 text-xs text-muted-foreground">
          <span className="text-[11px] opacity-75">Rate talk:</span>
          <button
            type="button"
            aria-label="Score response as helpful"
            onClick={() => handleRate(1)}
            className={cn(
              "flex items-center gap-1 rounded px-1.5 py-0.5 transition-colors hover:bg-emerald-500/10 hover:text-emerald-600",
              rating === 1 && "bg-emerald-500/15 font-semibold text-emerald-600 dark:text-emerald-400"
            )}
          >
            <ThumbsUp className="h-3 w-3" />
            {rating === 1 && <span>Helpful</span>}
          </button>
          <button
            type="button"
            aria-label="Score response as not helpful"
            onClick={() => handleRate(-1)}
            className={cn(
              "flex items-center gap-1 rounded px-1.5 py-0.5 transition-colors hover:bg-rose-500/10 hover:text-rose-600",
              rating === -1 && "bg-rose-500/15 font-semibold text-rose-600 dark:text-rose-400"
            )}
          >
            <ThumbsDown className="h-3 w-3" />
            {rating === -1 && <span>Needs work</span>}
          </button>
        </div>
      )}
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export function ChatWidget({
  courses,
  mode = "computech",
}: {
  courses: Course[];
  mode?: "computech" | "library";
}) {
  const isLibrary = mode === "library";
  const initialWelcome = isLibrary ? WELCOME_LIBRARY : WELCOME_COMPUTECH;
  const quickReplies = isLibrary ? QUICK_REPLIES_LIBRARY : QUICK_REPLIES_COMPUTECH;
  const localStorageKey = isLibrary ? LOCAL_STORAGE_KEY_LIBRARY : LOCAL_STORAGE_KEY_COMPUTECH;

  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([initialWelcome]);
  const [input, setInput] = React.useState("");
  const [typing, setTyping] = React.useState(false);

  // Last course discussed, so follow-ups like "how long is it?" make sense.
  const lastCourseSlug = React.useRef<string | undefined>(undefined);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Load chat history & talk scores from localStorage on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(localStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load chat history from localStorage", e);
    }
  }, [localStorageKey]);

  // Save chat history & talk scores to localStorage on update
  React.useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem(localStorageKey, JSON.stringify(messages));
      }
    } catch (e) {
      console.error("Failed to save chat history to localStorage", e);
    }
  }, [messages, localStorageKey]);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  React.useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function handleScoreTalk(messageId: string, score: 1 | -1, question?: string, text?: string) {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, score } : msg))
    );

    // Send score to analytics API
    fetch("/api/chat/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messageId,
        question,
        responseText: text,
        score,
      }),
    }).catch((err) => console.error("Error submitting feedback:", err));
  }

  function handleResetChat() {
    setMessages([initialWelcome]);
    localStorage.removeItem(localStorageKey);
    lastCourseSlug.current = undefined;
  }

  async function send(raw: string) {
    const question = raw.trim();
    if (!question || typing) return;
    setInput("");

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: question,
    };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: question,
          history: messages,
          lastCourseSlug: lastCourseSlug.current,
          mode,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.courseSlug) lastCourseSlug.current = data.courseSlug;
        const botMsg: Message = {
          id: data.talkId ?? `bot-${Date.now()}`,
          role: "bot",
          text: data.text,
          links: data.links,
        };

        setMessages((prev) => [...prev, botMsg]);
        setTyping(false);
        return;
      }
    } catch (err) {
      console.error("AI Chat API call failed, using client fallback", err);
    }

    // Client fallback if API endpoint is unreachable
    const reply: BotReply = isLibrary
      ? answerLibrary(question, { lastCourseSlug: lastCourseSlug.current })
      : answer(question, courses, { lastCourseSlug: lastCourseSlug.current });

    if (reply.courseSlug) lastCourseSlug.current = reply.courseSlug;
    const botMsg: Message = {
      id: `bot-${Date.now()}`,
      role: "bot",
      text: reply.text,
      links: reply.links,
    };
    setMessages((prev) => [...prev, botMsg]);
    setTyping(false);
  }

  return (
    <>
      {/* Floating launcher — bottom-left, draggable on screen */}
      <DraggableFab
        className={cn(
          "chatbot-fab fixed bottom-20 left-6 z-40 transition-all",
          open && "pointer-events-none scale-90 opacity-0"
        )}
      >
        <button
          type="button"
          aria-label="Open AI chat assistant"
          onClick={() => setOpen(true)}
          className={cn(
            "group relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full shadow-md transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            isLibrary
              ? "bg-emerald-600 text-white shadow-emerald-600/30"
              : "bg-primary text-primary-foreground shadow-primary/30"
          )}
        >
          <Bot className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
          </span>
          <span className="fab-tip pointer-events-none absolute left-14 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-[11px] font-medium text-background opacity-0 shadow-md transition-opacity group-hover:opacity-100">
            {isLibrary ? "Ask about Library Seats 📚" : "Ask AI Assistant 🤖"}
          </span>
        </button>
      </DraggableFab>

      {/* Chat panel */}
      <div
        role="dialog"
        aria-label="Chat with AI assistant"
        className={cn(
          "chatbot-panel fixed bottom-6 left-6 z-50 flex w-[min(24rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl transition-all duration-200",
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        )}
        style={{ height: "min(32rem, calc(100dvh - 6rem))" }}
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-center gap-3 border-b border-border px-4 py-3 text-white",
            isLibrary ? "bg-emerald-700" : "bg-primary"
          )}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
            <Sparkles className="h-5 w-5 animate-pulse text-emerald-200" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold leading-tight">
                {isLibrary ? "Navya Library AI 📚" : "Navya AI Assistant"}
              </p>
              <span className="rounded bg-emerald-500/30 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-emerald-200 uppercase">
                AI Powered
              </span>
            </div>
            <p className="flex items-center gap-1.5 text-xs opacity-90">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              {isLibrary ? "Online — 24/7 Quiet Study Support" : "Online — 24/7 Intelligent Support"}
            </p>
          </div>
          <button
            type="button"
            aria-label="Reset chat history"
            title="Reset conversation"
            onClick={handleResetChat}
            className="rounded-md p-1.5 transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Close chat"
            onClick={() => setOpen(false)}
            className="rounded-md p-1.5 transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 space-y-3 overflow-y-auto overscroll-contain bg-secondary/40 p-4"
        >
          {messages.map((message, i) => {
            const prevQuestion =
              i > 0 && messages[i - 1].role === "user"
                ? messages[i - 1].text
                : undefined;
            return (
              <MessageBubble
                key={message.id || i}
                message={message}
                onScore={handleScoreTalk}
                prevQuestion={prevQuestion}
              />
            );
          })}
          {typing && <TypingDots />}
        </div>

        {/* Quick replies */}
        <div className="flex gap-1.5 overflow-x-auto border-t border-border bg-background px-3 pt-2.5 [scrollbar-width:none]">
          {quickReplies.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => send(q)}
              className={cn(
                "shrink-0 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors",
                isLibrary
                  ? "hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400"
                  : "hover:border-primary/40 hover:text-primary"
              )}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          className="flex items-center gap-2 bg-background p-3"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isLibrary ? "Ask about shifts, fees, Wi-Fi…" : "Ask about courses, fees, timings…"}
            aria-label="Type your question"
            className={cn(
              "h-10 flex-1 rounded-md border border-input bg-card px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground",
              isLibrary ? "focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" : "focus:border-ring focus:ring-1 focus:ring-ring"
            )}
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!input.trim() || typing}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-white transition-opacity hover:opacity-90 disabled:opacity-40",
              isLibrary ? "bg-emerald-600" : "bg-primary"
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </>
  );
}

