import type { Metadata } from "next";
import { BookOpen, Phone, Mail, Clock, CheckCircle2, Inbox, Users, ShieldCheck, Zap } from "lucide-react";
import { getInquiries } from "@/lib/db";
import {
  PageHeader,
  StatCard,
  TableCard,
  EmptyState,
  StatusPill,
} from "@/components/admin/primitives";
import { InquiryControls } from "@/components/admin/inquiry-controls";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CONTACT } from "@/lib/data";

export const metadata: Metadata = {
  title: "Navya Library Management | Admin",
};

export const dynamic = "force-dynamic";

const SHIFT_PRICING = [
  { name: "Morning Shift", timing: "6:00 AM – 2:00 PM", fee: "₹799 / mo", icon: Clock },
  { name: "Evening Shift", timing: "2:00 PM – 10:00 PM", fee: "₹799 / mo", icon: Clock },
  { name: "Full Day Shift", timing: "6:00 AM – 10:00 PM", fee: "₹1,399 / mo", icon: Zap },
  { name: "24/7 Unlimited", timing: "Round-the-Clock Access", fee: "₹1,799 / mo", icon: ShieldCheck },
];

export default async function AdminLibraryPage() {
  const allInquiries = await getInquiries();
  
  // Filter inquiries related to Navya Library seat bookings
  const libraryInquiries = allInquiries.filter(
    (q) =>
      q.preferredCourse?.toLowerCase().includes("library") ||
      q.preferredCourse?.toLowerCase().includes("seat") ||
      q.preferredCourse?.toLowerCase().includes("reading") ||
      q.message?.toLowerCase().includes("shift") ||
      q.message?.toLowerCase().includes("library") ||
      q.message?.toLowerCase().includes("trial")
  );

  const newInquiries = libraryInquiries.filter((q) => q.status === "new");
  const enrolledInquiries = libraryInquiries.filter((q) => q.status === "enrolled");
  const contactedInquiries = libraryInquiries.filter((q) => q.status === "contacted");

  return (
    <div>
      <PageHeader
        title="Navya Library Management"
        description="Monitor seat reservation inquiries, shift selections, and active library memberships."
      />

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard
          label="Library Inquiries"
          value={libraryInquiries.length}
          icon={BookOpen}
          hint="Total seat requests"
        />
        <StatCard
          label="New Requests"
          value={newInquiries.length}
          icon={Inbox}
          hint="Needs counselor call"
        />
        <StatCard
          label="Contacted Aspirants"
          value={contactedInquiries.length}
          icon={Phone}
          hint="In follow-up pipeline"
        />
        <StatCard
          label="Enrolled Members"
          value={enrolledInquiries.length}
          icon={Users}
          hint="Active seat members"
        />
      </div>

      {/* Shift Overview Cards */}
      <div className="mt-8">
        <h2 className="mb-4 text-base font-bold tracking-tight">Active Library Shifts & Pricing</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SHIFT_PRICING.map((shift) => {
            const Icon = shift.icon;
            return (
              <Card key={shift.name} className="p-4 border-emerald-500/20 bg-emerald-500/5">
                <div className="flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                    <Icon className="h-4 w-4" />
                  </span>
                  <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-700 dark:text-emerald-300">
                    {shift.fee}
                  </Badge>
                </div>
                <p className="mt-3 text-sm font-bold">{shift.name}</p>
                <p className="text-xs text-muted-foreground">{shift.timing}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Library Inquiries Table */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold tracking-tight">Seat Reservation Requests</h2>
          <Badge variant="soft" className="text-xs">
            {libraryInquiries.length} Requests
          </Badge>
        </div>

        {libraryInquiries.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No Library Seat Requests Yet"
            description="When students reserve a seat or book a trial day from the Navya Library sub-site (/library), their requests will appear here."
          />
        ) : (
          <TableCard>
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Student Name &amp; Contact</th>
                <th className="px-4 py-3 font-medium">Selected Shift / Request</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Date</th>
                <th className="px-4 py-3 text-right font-medium">Status / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {libraryInquiries.map((q) => (
                <tr key={q._id} className="align-top hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-sm">{q.fullName}</p>
                    <a
                      href={`tel:${q.phone}`}
                      className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-emerald-600"
                    >
                      <Phone className="h-3.5 w-3.5 text-emerald-500" />
                      {q.phone}
                    </a>
                    {q.email && (
                      <a
                        href={`mailto:${q.email}`}
                        className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-emerald-600"
                      >
                        <Mail className="h-3.5 w-3.5 text-emerald-500" />
                        {q.email}
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-4 text-xs">
                    <Badge variant="soft" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium">
                      {q.message || q.preferredCourse || "Library Seat Request"}
                    </Badge>
                    <div className="mt-2 sm:hidden">
                      <StatusPill status={q.status} />
                    </div>
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-4 text-xs text-muted-foreground sm:table-cell">
                    {new Date(q.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <InquiryControls id={q._id} status={q.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </TableCard>
        )}
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Tip: Update inquiry status (new → contacted → enrolled) to manage seat allocation pipeline. Counselors can contact students directly at {CONTACT.phone}.
      </p>
    </div>
  );
}
