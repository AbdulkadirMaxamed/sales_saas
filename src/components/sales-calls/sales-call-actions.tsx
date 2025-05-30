"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import {
  updateSalesCall,
  deleteSalesCall,
  type SalesCallWithUser,
} from "@/lib/actions/sales-calls";

interface SalesCallActionsProps {
  salesCall: SalesCallWithUser;
}

export function SalesCallActions({ salesCall }: SalesCallActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpdate(formData: FormData) {
    setIsLoading(true);
    try {
      await updateSalesCall(salesCall.id, formData);
      setEditOpen(false);
      console.log("Sales call updated successfully!");
    } catch (error) {
      console.error("Failed to update sales call", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    setIsLoading(true);
    try {
      await deleteSalesCall(salesCall.id);
      setDeleteOpen(false);
      console.log("Sales call deleted successfully!");
    } catch (error) {
      console.error("Failed to delete sales call", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setDeleteOpen(true)}
            className="text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Sales Call</DialogTitle>
            <DialogDescription>
              Update the sales call information.
            </DialogDescription>
          </DialogHeader>
          <form action={handleUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-date" className="text-right">
                  Date
                </Label>
                <Input
                  id="edit-date"
                  name="date"
                  type="date"
                  defaultValue={salesCall.date}
                  required
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-time" className="text-right">
                  Time
                </Label>
                <Input
                  id="edit-time"
                  name="time"
                  type="time"
                  defaultValue={salesCall.time}
                  required
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-customer" className="text-right">
                  Customer
                </Label>
                <Input
                  id="edit-customer"
                  name="customer"
                  defaultValue={salesCall.customer}
                  required
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-duration" className="text-right">
                  Duration
                </Label>
                <Input
                  id="edit-duration"
                  name="duration"
                  defaultValue={salesCall.duration}
                  required
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-sentiment" className="text-right">
                  Sentiment
                </Label>
                <Select name="sentiment" defaultValue={salesCall.sentiment}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Positive">Positive</SelectItem>
                    <SelectItem value="Negative">Negative</SelectItem>
                    <SelectItem value="Neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-progress" className="text-right">
                  Progress
                </Label>
                <Input
                  id="edit-progress"
                  name="ai_processing_progress"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={salesCall.ai_processing_progress}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <Select name="status" defaultValue={salesCall.status}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Complete">Complete</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Call"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Sales Call</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this sales call? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
