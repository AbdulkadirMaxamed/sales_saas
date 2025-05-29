export interface SalesCall {
  id: string;
  date: string;
  time: string;
  customer: string;
  duration: string;
  sentiment: "Positive" | "Negative" | "Neutral";
  ai_processing_progress: number;
  status: "Complete" | "Processing";
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      sales_calls: {
        Row: SalesCall;
        Insert: Omit<SalesCall, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<SalesCall, "id" | "created_at" | "updated_at">>;
      };
    };
  };
}
