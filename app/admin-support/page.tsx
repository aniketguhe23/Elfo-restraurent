"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";
import ProjectApiList from "../api/ProjectApiList";

interface SupportTicket {
  id: number;
  restaurant_id: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export default function ContactSupportPage() {
  const { apigetAdminSupport, apipostAdminSupport } = ProjectApiList();
  const { restaurant } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSupportTickets = async (pageNumber = 1) => {
    try {
      const res = await axios.get(
        `${apigetAdminSupport}?restaurant_id=${restaurant?.restaurants_no || ""}&page=${pageNumber}&limit=${limit}`
      );

      const { data, total } = res.data;

      setTickets(data || []);
      setTotalPages(Math.max(1, Math.ceil((total || 0) / limit)));
    } catch (err) {
      console.error("Error fetching support tickets:", err);
    }
  };

  useEffect(() => {
    if (restaurant?.restaurants_no) {
      fetchSupportTickets(page);
    }
  }, [restaurant?.restaurants_no, page]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [totalPages]);

  const handleSubmit = async () => {
    if (!restaurant?.restaurants_no) return;
    setIsSubmitting(true);

    const payload = {
      restaurant_id: restaurant.restaurants_no,
      subject,
      message,
    };

    try {
      await axios.post(apipostAdminSupport, payload);
      setSubject("");
      setMessage("");
      setIsDialogOpen(false);
      fetchSupportTickets();
      setPage(1); // Reset to first page after submission
    } catch (err) {
      console.error("Error submitting support request:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Support Tickets
        </h2>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-500">
              <Plus className="w-4 h-4 mr-1" />
              Admin Support
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Admin Support</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="subject">
                  Subject
                </label>
                <Input
                  id="subject"
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="message">
                  Message
                </label>
                <Textarea
                  id="message"
                  rows={4}
                  placeholder="Describe your issue..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <div className="text-right">
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Submit"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">{ticket.subject}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {format(new Date(ticket.created_at), "PPPpp")}
              </p>
            </CardHeader>
            <CardContent>
              <p className="mb-2">{ticket.message}</p>
              <p className="text-sm text-gray-600">
                Status: <strong>{ticket.status}</strong>
              </p>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-between items-center mt-6">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline"
            // disabled={page >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>

        {tickets.length === 0 && (
          <p className="text-gray-500 text-center">No support tickets found.</p>
        )}
      </div>
    </div>
  );
}
