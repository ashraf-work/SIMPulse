"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { FormField } from "@/components/common/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/apiClient";

const initial = { subject: "", email: "", message: "" };

export function ContactForm() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const nextErrors = {};
    if (form.subject.trim().length < 3) nextErrors.subject = "Subject is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Enter a valid email.";
    if (form.message.trim().length < 10) nextErrors.message = "Message must be at least 10 characters.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function submit(event) {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await apiRequest("/api/public/contact", { method: "POST", body: JSON.stringify(form) });
      toast.success("Message submitted");
      setForm(initial);
      setErrors({});
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <FormField label="Subject" error={errors.subject}>
        <Input value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} placeholder="Activation support" />
      </FormField>
      <FormField label="Email" error={errors.email}>
        <Input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" />
      </FormField>
      <FormField label="Message" error={errors.message}>
        <textarea
          className="min-h-32 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none transition duration-200 placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
          value={form.message}
          onChange={(event) => setForm({ ...form, message: event.target.value })}
          placeholder="Tell us what you need help with..."
        />
      </FormField>
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Message"}
      </Button>
    </form>
  );
}
