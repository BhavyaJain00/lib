import Link from "next/link";
import {
  Inbox,
  BookOpen,
  Activity as ActivityIcon,
  ArrowRight,
  Clock,
  AlertCircle,
} from "lucide-react";
import { isDbConfigured } from "@/lib/mongodb";
import { getCounts, getInquiries, getActivity } from "@/lib/db";
import {
  PageHeader,
  StatCard,
  StatusPill,
  EmptyState,
  DbNotice,
} from "@/components/admin/primitives";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [counts, inquiries, activity] = await Promise.all([
    getCounts(),
    getInquiries(),
    getActivity(6),
  ]);
  const recent = inquiries.slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Overview"
        description="A snapshot of queries, courses and everything happening on the site."
      />

      {!isDbConfigured && <DbNotice />}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Queries"
          value={counts.inquiries}
          icon={Inbox}
          hint={`${counts.newInquiries} new / unhandled`}
        />
        <StatCard label="Live Courses" value={counts.courses} icon={BookOpen} />
        <StatCard
          label="Activity Events"
          value={counts.activity}
          icon={ActivityIcon}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Recent queries */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Recent Queries</h2>
            <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary">
              <Link href="/admin/inquiries">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {recent.length > 0 ? (
            <ul className="divide-y divide-border">
              {recent.map((row) => (
                <li
                  key={row._id}
                  className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{row.fullName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {row.preferredCourse || "No course selected"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(row.createdAt).toLocaleDateString("en-IN")}
                    </span>
                    <StatusPill status={row.status} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={AlertCircle}
              title="No queries yet"
              description="Submissions from the site's query form appear here."
            />
          )}
        </Card>

        {/* Recent activity */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Latest Activity</h2>
            <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary">
              <Link href="/admin/activity">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {activity.length > 0 ? (
            <ul className="divide-y divide-border">
              {activity.map((row) => (
                <li key={row._id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{row.summary}</p>
                    <p className="text-xs text-muted-foreground">
                      {row.actor} ·{" "}
                      {new Date(row.createdAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={ActivityIcon}
              title="No activity yet"
              description="Queries and admin changes are logged here automatically."
            />
          )}
        </Card>
      </div>
    </div>
  );
}
