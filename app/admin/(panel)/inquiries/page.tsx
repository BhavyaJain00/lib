import { Inbox, Phone, Mail, Download } from "lucide-react";
import { isDbConfigured } from "@/lib/mongodb";
import { getInquiries } from "@/lib/db";
import {
  PageHeader,
  TableCard,
  EmptyState,
  StatusPill,
  DbNotice,
} from "@/components/admin/primitives";
import { InquiryControls } from "@/components/admin/inquiry-controls";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries();

  return (
    <div>
      <PageHeader
        title="Queries"
        description={`${inquiries.length} total · every enquiry submitted from the website.`}
        action={
          inquiries.length > 0 ? (
            <Button asChild variant="outline">
              <a href="/admin/inquiries/export">
                <Download className="h-4 w-4" />
                Export CSV
              </a>
            </Button>
          ) : undefined
        }
      />

      {!isDbConfigured && <DbNotice />}

      {inquiries.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No queries yet"
          description="When visitors submit the query form on the website, they show up here."
        />
      ) : (
        <TableCard>
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Name &amp; Contact</th>
              <th className="px-4 py-3 font-medium">Course</th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">Message</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Date</th>
              <th className="px-4 py-3 text-right font-medium">Status / Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {inquiries.map((q) => (
              <tr key={q._id} className="align-top">
                <td className="px-4 py-4">
                  <p className="font-medium">{q.fullName}</p>
                  <a
                    href={`tel:${q.phone}`}
                    className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {q.phone}
                  </a>
                  {q.email && (
                    <a
                      href={`mailto:${q.email}`}
                      className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      {q.email}
                    </a>
                  )}
                </td>
                <td className="px-4 py-4">
                  {q.preferredCourse ? (
                    <span className="text-sm">{q.preferredCourse}</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                  <div className="mt-2 sm:hidden">
                    <StatusPill status={q.status} />
                  </div>
                </td>
                <td className="hidden max-w-xs px-4 py-4 lg:table-cell">
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {q.message || "—"}
                  </p>
                </td>
                <td className="hidden whitespace-nowrap px-4 py-4 text-sm text-muted-foreground sm:table-cell">
                  {new Date(q.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-4">
                  <InquiryControls id={q._id} status={q.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </TableCard>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        Tip: change a status to track your pipeline — new → contacted → enrolled.
        Reach students directly at {CONTACT.phone}.
      </p>
    </div>
  );
}
