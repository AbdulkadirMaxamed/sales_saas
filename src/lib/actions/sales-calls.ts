"use server";

import { createClient } from "@/lib/supabase/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Database } from "@/lib/types/database";
import { getUsersById, type UserInfo } from "./user-utils";

type SalesCall = Database["public"]["Tables"]["sales_calls"]["Row"];
type InsertSalesCall = Database["public"]["Tables"]["sales_calls"]["Insert"];
type UpdateSalesCall = Database["public"]["Tables"]["sales_calls"]["Update"];

export interface SalesCallWithUser extends SalesCall {
  user?: UserInfo;
}

export async function getSalesCalls(): Promise<SalesCallWithUser[]> {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const supabase = await createClient();
  const clerkUser = await currentUser();

  // Check if user is admin based on private metadata
  const isAdmin = clerkUser?.privateMetadata?.admin === true;

  let query = supabase.from("sales_calls").select("*");

  // If not admin, filter by user_id
  if (!isAdmin) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching sales calls:", error);
    return [];
  }

  const salesCalls = data || [];

  // If admin, fetch user information for each call
  if (isAdmin && salesCalls.length > 0) {
    const userIds = salesCalls.map((call) => call.user_id);
    const usersMap = await getUsersById(userIds);

    // Add user information to each sales call
    return salesCalls.map((call) => ({
      ...call,
      user: usersMap.get(call.user_id),
    }));
  }

  return salesCalls;
}

export async function createSalesCall(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const supabase = await createClient();

  const salesCallData: InsertSalesCall = {
    date: formData.get("date") as string,
    time: formData.get("time") as string,
    customer: formData.get("customer") as string,
    duration: formData.get("duration") as string,
    sentiment: formData.get("sentiment") as "Positive" | "Negative" | "Neutral",
    ai_processing_progress:
      parseInt(formData.get("ai_processing_progress") as string) || 0,
    status: formData.get("status") as "Complete" | "Processing",
    user_id: userId,
  };

  const { error } = await supabase.from("sales_calls").insert(salesCallData);

  if (error) {
    console.error("Error creating sales call:", error);
    throw new Error("Failed to create sales call");
  }

  revalidatePath("/sales-calls");
}

export async function updateSalesCall(id: string, formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const supabase = await createClient();

  const updateData: UpdateSalesCall = {
    date: formData.get("date") as string,
    time: formData.get("time") as string,
    customer: formData.get("customer") as string,
    duration: formData.get("duration") as string,
    sentiment: formData.get("sentiment") as "Positive" | "Negative" | "Neutral",
    ai_processing_progress: parseInt(
      formData.get("ai_processing_progress") as string,
    ),
    status: formData.get("status") as "Complete" | "Processing",
  };

  const { error } = await supabase
    .from("sales_calls")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("Error updating sales call:", error);
    throw new Error("Failed to update sales call");
  }

  revalidatePath("/sales-calls");
}

export async function deleteSalesCall(id: string) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("sales_calls")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("Error deleting sales call:", error);
    throw new Error("Failed to delete sales call");
  }

  revalidatePath("/sales-calls");
}

export async function getCurrentUserAdmin(): Promise<boolean> {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  const clerkUser = await currentUser();
  return clerkUser?.privateMetadata?.admin === true;
}
