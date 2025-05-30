import { auth } from "@clerk/nextjs/server";
import {
  Activity,
  CheckCircle,
  Clock,
  Loader2,
  Phone,
  TrendingUp,
  User,
} from "lucide-react";
import { redirect } from "next/navigation";
import { getSalesCalls, getCurrentUserAdmin } from "@/lib/actions/sales-calls";
import { AddSalesCallDialog } from "@/components/sales-calls/add-sales-call-dialog";
import { SalesCallActions } from "@/components/sales-calls/sales-call-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function getSentimentBadge(sentiment: string) {
  switch (sentiment.toLowerCase()) {
    case "positive":
      return (
        <div className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
          <TrendingUp className="w-3 h-3 mr-1" />
          Positive
        </div>
      );
    case "negative":
      return (
        <div className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
          Negative
        </div>
      );
    case "neutral":
      return (
        <div className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/20">
          Neutral
        </div>
      );
    default:
      return (
        <div className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/20">
          Unknown
        </div>
      );
  }
}

function getProgressIndicator(progress: number, status: string) {
  if (status === "Complete") {
    return (
      <div className="flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-green-600" />
        <span className="text-sm text-green-600 font-medium">Complete</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-center gap-1">
        <Loader2 className="w-3 h-3 text-blue-600 animate-spin" />
        <span className="text-sm text-gray-600 font-medium">{progress}%</span>
      </div>
    </div>
  );
}

export default async function SalesCallsPage() {
  const { userId } = await auth();

  // If user is not signed in, redirect to login
  if (!userId) {
    redirect("/login");
  }

  // Fetch sales calls data and check if user is admin
  const [salesCalls, isAdmin] = await Promise.all([
    getSalesCalls(),
    getCurrentUserAdmin(),
  ]);

  // Calculate statistics
  const totalCalls = salesCalls.length;
  const completedCalls = salesCalls.filter(
    (call) => call.status === "Complete",
  ).length;
  const positiveCalls = salesCalls.filter(
    (call) => call.sentiment.toLowerCase() === "positive",
  ).length;
  const positiveRate =
    totalCalls > 0 ? Math.round((positiveCalls / totalCalls) * 100) : 0;
  const avgDuration =
    totalCalls > 0
      ? Math.round(
          salesCalls.reduce((acc, call) => {
            const duration = parseInt(call.duration.replace(/\D/g, "")) || 0;
            return acc + duration;
          }, 0) / totalCalls,
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Calls</h1>
          <p className="text-muted-foreground">
            Track and analyze your sales conversations
          </p>
        </div>
        <AddSalesCallDialog />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Calls</h3>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{totalCalls}</div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Avg Duration</h3>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{avgDuration} min</div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">
              Positive Rate
            </h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{positiveRate}%</div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Processed</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">
            {completedCalls}/{totalCalls}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Recent Calls</h2>
        </div>
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Date & Time
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Customer
                </th>
                {isAdmin && (
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    User
                  </th>
                )}
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Duration
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Sentiment
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Processing
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {salesCalls.map((call) => (
                <tr
                  key={call.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        {new Date(call.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {call.time}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{call.customer}</span>
                    </div>
                  </td>
                  {isAdmin && (
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={call.user?.imageUrl}
                            alt={`${call.user?.firstName} ${call.user?.lastName}`}
                          />
                          <AvatarFallback className="text-xs">
                            {call.user?.firstName?.[0]}
                            {call.user?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {call.user?.firstName && call.user?.lastName
                              ? `${call.user.firstName} ${call.user.lastName}`
                              : call.user?.emailAddress || "Unknown User"}
                          </span>
                          {call.user?.emailAddress && call.user?.firstName && (
                            <span className="text-xs text-muted-foreground">
                              {call.user.emailAddress}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                  )}
                  <td className="p-4 align-middle">
                    <span className="text-sm">{call.duration}</span>
                  </td>
                  <td className="p-4 align-middle">
                    {getSentimentBadge(call.sentiment)}
                  </td>
                  <td className="p-4 align-middle">
                    <div className="w-40">
                      {getProgressIndicator(
                        call.ai_processing_progress,
                        call.status,
                      )}
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <SalesCallActions salesCall={call} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {salesCalls.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
          <Phone className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No calls recorded</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            Your sales calls will appear here once they&apos;re uploaded and
            processed.
          </p>
          <AddSalesCallDialog />
        </div>
      )}
    </div>
  );
}
