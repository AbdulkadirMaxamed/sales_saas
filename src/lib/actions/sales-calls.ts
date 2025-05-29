"use server";

import { createClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Database } from "@/lib/types/database";

type SalesCall = Database["public"]["Tables"]["sales_calls"]["Row"];
type InsertSalesCall = Database["public"]["Tables"]["sales_calls"]["Insert"];
type UpdateSalesCall = Database["public"]["Tables"]["sales_calls"]["Update"];

export async function getSalesCalls(): Promise<SalesCall[]> {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sales_calls")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching sales calls:", error);
    return [];
  }

  return data || [];
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
