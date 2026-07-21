import type { Metadata } from "next";
import { MessageSquare, ThumbsUp, ThumbsDown, Sparkles, Bot } from "lucide-react";
import { getChatTalks, type ChatTalkDoc } from "@/lib/db";
import { PageHeader, StatCard, EmptyState, TableCard } from "@/components/admin/primitives";
import { ChatTalkDeleteButton } from "@/components/admin/chat-talk-delete-button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Chat Talks & User Feedback | Admin",
};

export const dynamic = "force-dynamic";

function formatTalkDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default async function AdminChatsPage() {
  const talks = await getChatTalks();

  const totalCount = talks.length;
  const helpfulCount = talks.filter((t) => t.score === 1).length;
  const needsWorkCount = talks.filter((t) => t.score === -1).length;
  const unratedCount = talks.filter((t) => t.score === null || t.score === undefined).length;

  return (
    <div>
      <PageHeader
        title="Chat Talks & Feedback"
        description="Monitor user queries, AI responses, and talk feedback rating scores."
      />

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard
          label="Total Talks"
          value={totalCount}
          icon={MessageSquare}
          hint="Conversations logged"
        />
        <StatCard
          label="Helpful Ratings"
          value={helpfulCount}
          icon={ThumbsUp}
          hint="Positive feedback (👍)"
        />
        <StatCard
          label="Needs Work"
          value={needsWorkCount}
          icon={ThumbsDown}
          hint="Negative feedback (👎)"
        />
        <StatCard
          label="Unrated Talks"
          value={unratedCount}
          icon={Bot}
          hint="Pending rating"
        />
      </div>

      {/* Talks List */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-bold tracking-tight">Recent User Conversations</h2>

        {talks.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No Chatbot Talks Logged Yet"
            description="When users interact with the AI Chatbot on the website, their questions, bot responses, and rating scores will appear here."
          />
        ) : (
          <TableCard>
            <thead className="border-b border-border bg-muted/40 text-left text-xs font-semibold text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">User Question</th>
                <th className="px-4 py-3">Bot Response</th>
                <th className="px-4 py-3">Engine</th>
                <th className="px-4 py-3">Rating Score</th>
                <th className="px-4 py-3 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {talks.map((talk: ChatTalkDoc) => (
                <tr key={talk._id} className="hover:bg-muted/20 transition-colors">
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                    {formatTalkDate(talk.createdAt)}
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground max-w-xs">
                    <p className="line-clamp-2">{talk.userQuestion}</p>
                    {talk.courseSlug && (
                      <Badge variant="outline" className="mt-1 text-[10px]">
                        Course: {talk.courseSlug}
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-md">
                    <div className="line-clamp-3 whitespace-pre-line leading-relaxed">
                      {talk.botReply}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs">
                    {talk.isAi ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-0.5 font-medium text-purple-600 dark:text-purple-400">
                        <Sparkles className="h-3 w-3" />
                        AI LLM
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/10 px-2.5 py-0.5 font-medium text-slate-600 dark:text-slate-400">
                        <Bot className="h-3 w-3" />
                        Local Engine
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs">
                    {talk.score === 1 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
                        <ThumbsUp className="h-3.5 w-3.5" />
                        Helpful (+1)
                      </span>
                    )}
                    {talk.score === -1 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 font-semibold text-rose-600 dark:text-rose-400">
                        <ThumbsDown className="h-3.5 w-3.5" />
                        Needs Work (-1)
                      </span>
                    )}
                    {(talk.score === null || talk.score === undefined) && (
                      <span className="text-muted-foreground text-[11px] opacity-70">
                        Unrated
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <ChatTalkDeleteButton id={talk._id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </TableCard>
        )}
      </div>
    </div>
  );
}

