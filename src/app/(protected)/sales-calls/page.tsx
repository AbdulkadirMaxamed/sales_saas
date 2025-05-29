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

// Mock data for sales calls - replace with real data from your database
const salesCalls = [
  {
    id: 1,
    date: "2025-05-28",
    time: "14:30",
    customer: "Acme Corp",
    duration: "45 min",
    sentiment: "Positive",
    aiProcessingProgress: 100,
    status: "Complete",
  },
];

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sales Calls</h1>
        <p className="text-muted-foreground">
          Track and analyze your sales conversations
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Calls</h3>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{salesCalls.length}</div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Avg Duration</h3>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">39 min</div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">
              Positive Rate
            </h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">60%</div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Processed</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">
            {salesCalls.filter((call) => call.status === "Complete").length}/
            {salesCalls.length}
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
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Duration
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Sentiment
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Processing
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
                  <td className="p-4 align-middle">
                    <span className="text-sm">{call.duration}</span>
                  </td>
                  <td className="p-4 align-middle">
                    {getSentimentBadge(call.sentiment)}
                  </td>
                  <td className="p-4 align-middle">
                    <div className="w-40">
                      {getProgressIndicator(
                        call.aiProcessingProgress,
                        call.status,
                      )}
                    </div>
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
        </div>
      )}
    </div>
  );
}
