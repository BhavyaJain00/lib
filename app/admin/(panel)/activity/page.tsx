import {
  Activity as ActivityIcon,
  Inbox,
  BookOpen,
  LogIn,
  Trash2,
  Pencil,
  Plus,
} from "lucide-react";
import { getActivity } from "@/lib/db";
import {
  PageHeader,
  EmptyState,
} from "@/components/admin/primitives";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

/** Icon + colour per activity type. */
const STYLES: Record<
  string,
  { icon: React.ComponentType<{ className?: string }>; tone: string; label: string }
> = {
  inquiry: { icon: Inbox, tone: "bg-blue-500/10 text-blue-600 dark:text-blue-400", label: "Query" },
  inquiry_status: { icon: Pencil, tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400", label: "Query" },
  inquiry_deleted: { icon: Trash2, tone: "bg-red-500/10 text-red-600 dark:text-red-400", label: "Query" },
  course_created: { icon: Plus, tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", label: "Course" },
  course_updated: { icon: Pencil, tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400", label: "Course" },
  course_deleted: { icon: Trash2, tone: "bg-red-500/10 text-red-600 dark:text-red-400", label: "Course" },
  admin_login: { icon: LogIn, tone: "bg-slate-500/10 text-slate-600 dark:text-slate-400", label: "Auth" },
};

const FALLBACK = {
  icon: BookOpen,
  tone: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  label: "Event",
};

export default async function AdminActivityPage() {
  const activity = await getActivity(200);

  return (
    <div>
      <PageHeader
        title="Activity"
        description="Everything that happens on the website and in this panel — queries received, courses changed, reviews added."
      />

      {activity.length === 0 ? (
        <EmptyState
          icon={ActivityIcon}
          title="No activity recorded yet"
          description="Queries from the website and changes you make here are logged automatically."
        />
      ) : (
        <Card className="p-5 sm:p-6">
          <ol className="relative space-y-5 border-l border-border pl-6">
            {activity.map((row) => {
              const style = STYLES[row.type] ?? FALLBACK;
              const Icon = style.icon;
              return (
                <li key={row._id} className="relative">
                  <span
                    className={`absolute -left-[35px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-card ${style.tone}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">{row.summary}</p>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${style.tone}`}>
                        {style.label}
                      </span>
                    </div>
                    {row.detail && (
                      <p className="text-xs text-muted-foreground">{row.detail}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {row.actor} ·{" "}
                      {new Date(row.createdAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </Card>
      )}
    </div>
  );
}
