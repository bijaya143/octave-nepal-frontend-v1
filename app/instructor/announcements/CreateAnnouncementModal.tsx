"use client";
import React from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { Send } from "lucide-react";

type CreateAnnouncementModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    title: string;
    course: "All" | string;
    content: string;
    scheduledAt?: string;
  }) => void;
  courses?: readonly string[] | string[];
};

const DEFAULT_COURSES = [
  "React 19 Fundamentals",
  "TypeScript Mastery",
  "Node.js APIs",
];

export default function CreateAnnouncementModal({ open, onClose, onSubmit, courses = DEFAULT_COURSES }: CreateAnnouncementModalProps) {
  const [title, setTitle] = React.useState("");
  const [course, setCourse] = React.useState<"All" | string>("All");
  const [content, setContent] = React.useState("");
  const [scheduledAt, setScheduledAt] = React.useState("");

  function reset() {
    setTitle("");
    setCourse("All");
    setContent("");
    setScheduledAt("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit?.({ title, course, content, scheduledAt: scheduledAt || undefined });
    onClose();
    reset();
  }

  return (
    <Modal open={open} onClose={() => { onClose(); reset(); }} title="Create announcement">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Select value={course} onChange={(e) => setCourse(e.target.value)}>
          <option value="All">All courses</option>
          {courses.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
        <Textarea label="Message" value={content} onChange={(e) => setContent(e.target.value)} required rows={6} />
        <div>
          <label className="text-sm font-medium text-[color:var(--foreground)]">Schedule (optional)</label>
          <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={() => { onClose(); reset(); }}>Cancel</Button>
          <Button type="submit" className="inline-flex items-center gap-2">
            <Send size={16} />
            {scheduledAt ? "Schedule" : "Publish"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}


