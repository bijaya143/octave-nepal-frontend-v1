"use client";
import React from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

export type SyllabusItemType = "lesson" | "quiz" | "assignment" | "resource" | "group" | "custom";
export type SyllabusItem = {
  id: string;
  type: SyllabusItemType;
  title: string;
  description?: string;
  durationMinutes?: number;
  isPreview?: boolean;
  children?: SyllabusItem[]; // for type === "group"
};
export type SyllabusSection = { id: string; title: string; description?: string; items: SyllabusItem[] };

type SyllabusBuilderProps = {
  value: SyllabusSection[];
  onChange: (next: SyllabusSection[]) => void;
};

function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

export default function SyllabusBuilder({ value, onChange }: SyllabusBuilderProps) {
  const addSection = React.useCallback(() => {
    onChange([...value, { id: uid("sec"), title: "New Section", description: "", items: [] }]);
  }, [value, onChange]);

  const updateSection = React.useCallback((si: number, patch: Partial<SyllabusSection>) => {
    onChange(value.map((s, i) => (i === si ? { ...s, ...patch } : s)));
  }, [value, onChange]);

  const moveSection = React.useCallback((si: number, dir: -1 | 1) => {
    const next = [...value];
    const j = si + dir;
    if (j < 0 || j >= next.length) return;
    const [s] = next.splice(si, 1);
    next.splice(j, 0, s);
    onChange(next);
  }, [value, onChange]);

  const removeSection = React.useCallback((si: number) => {
    onChange(value.filter((_, i) => i !== si));
  }, [value, onChange]);

  const addItem = React.useCallback((si: number, kind: SyllabusItemType = "lesson") => {
    const sec = value[si];
    const it: SyllabusItem = { id: uid("it"), type: kind, title: kind === "group" ? "New Group" : "New Item", description: "", isPreview: true, children: kind === "group" ? [] : undefined };
    onChange(value.map((s, i) => (i === si ? { ...s, items: [...sec.items, it] } : s)));
  }, [value, onChange]);

  const updateItem = React.useCallback((si: number, ii: number, patch: Partial<SyllabusItem>) => {
    onChange(value.map((s, i) => (i !== si ? s : { ...s, items: s.items.map((it, j) => (j === ii ? { ...it, ...patch } : it)) })));
  }, [value, onChange]);

  const moveItem = React.useCallback((si: number, ii: number, dir: -1 | 1) => {
    onChange(value.map((s, i) => {
      if (i !== si) return s;
      const items = [...s.items];
      const j = ii + dir;
      if (j < 0 || j >= items.length) return s;
      const [it] = items.splice(ii, 1);
      items.splice(j, 0, it);
      return { ...s, items };
    }));
  }, [value, onChange]);

  const removeItem = React.useCallback((si: number, ii: number) => {
    onChange(value.map((s, i) => (i !== si ? s : { ...s, items: s.items.filter((_, j) => j !== ii) })));
  }, [value, onChange]);

  const addChild = React.useCallback((si: number, ii: number, kind: SyllabusItemType = "lesson") => {
    onChange(value.map((s, i) => {
      if (i !== si) return s;
      return {
        ...s,
        items: s.items.map((it, j) => {
          if (j !== ii || it.type !== "group") return it;
          const ch: SyllabusItem = { id: uid("sub"), type: kind, title: "New Sub-Item", description: "", isPreview: true };
          return { ...it, children: [...(it.children || []), ch] };
        }),
      };
    }));
  }, [value, onChange]);

  const updateChild = React.useCallback((si: number, ii: number, ci: number, patch: Partial<SyllabusItem>) => {
    onChange(value.map((s, i) => {
      if (i !== si) return s;
      return {
        ...s,
        items: s.items.map((it, j) => {
          if (j !== ii || it.type !== "group" || !it.children) return it;
          return { ...it, children: it.children.map((c, k) => (k === ci ? { ...c, ...patch } : c)) };
        }),
      };
    }));
  }, [value, onChange]);

  const removeChild = React.useCallback((si: number, ii: number, ci: number) => {
    onChange(value.map((s, i) => {
      if (i !== si) return s;
      return {
        ...s,
        items: s.items.map((it, j) => {
          if (j !== ii || it.type !== "group" || !it.children) return it;
          return { ...it, children: it.children.filter((_, k) => k !== ci) };
        }),
      };
    }));
  }, [value, onChange]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Button type="button" size="sm" onClick={addSection} className="inline-flex items-center gap-1"><Plus size={16} /> Add section</Button>
      </div>
      <div className="space-y-3">
        {value.length === 0 ? (
          <div className="rounded-md border border-[color:var(--color-neutral-200)] bg-white px-3 py-2 text-[color:var(--color-neutral-700)] text-sm">No sections yet. Click "Add section" to start.</div>
        ) : (
          value.map((section, si) => (
            <div key={section.id} className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white">
              <div className="flex flex-col gap-2 p-3">
                <div className="flex items-center gap-2">
                  <Input value={section.title} onChange={(e) => updateSection(si, { title: e.target.value })} placeholder={`Section ${si + 1} title`} />
                  <div className="ml-auto inline-flex items-center gap-1">
                    <button type="button" aria-label="Move up" className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-[color:var(--color-neutral-200)] hover:bg-[color:var(--color-neutral-50)]" onClick={() => moveSection(si, -1)}><ChevronUp size={16} /></button>
                    <button type="button" aria-label="Move down" className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-[color:var(--color-neutral-200)] hover:bg-[color:var(--color-neutral-50)]" onClick={() => moveSection(si, 1)}><ChevronDown size={16} /></button>
                    <button type="button" aria-label="Remove section" className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-[color:var(--color-neutral-200)] hover:bg-red-50 text-red-600" onClick={() => removeSection(si)}><Trash2 size={16} /></button>
                  </div>
                </div>
                <Textarea value={section.description || ""} onChange={(e) => updateSection(si, { description: e.target.value })} placeholder="Section description (optional)" rows={2} />
                <div className="flex items-center gap-2">
                  <label className="text-xs text-[color:var(--color-neutral-600)]">Add item</label>
                  <Select defaultValue="lesson" onChange={(e) => addItem(si, e.target.value as SyllabusItemType)}>
                    <option value="lesson">Lesson</option>
                    <option value="quiz">Quiz</option>
                    <option value="assignment">Assignment</option>
                    <option value="resource">Resource</option>
                    <option value="group">Group</option>
                    <option value="custom">Custom</option>
                  </Select>
                  <Button type="button" size="sm" onClick={() => addItem(si, "lesson")} className="inline-flex items-center gap-1"><Plus size={16} /> Quick add</Button>
                </div>
                <div className="mt-2 divide-y divide-[color:var(--color-neutral-200)] rounded-md border border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-50)]">
                  {section.items.length === 0 ? (
                    <div className="px-3 py-2 text-[color:var(--color-neutral-600)] text-sm">No items yet.</div>
                  ) : (
                    section.items.map((it, ii) => (
                      <div key={it.id} className="px-3 py-2 space-y-2">
                        <div className="flex items-center gap-2">
                          <Select value={it.type} onChange={(e) => updateItem(si, ii, { type: e.target.value as SyllabusItemType })}>
                            <option value="lesson">Lesson</option>
                            <option value="quiz">Quiz</option>
                            <option value="assignment">Assignment</option>
                            <option value="resource">Resource</option>
                            <option value="group">Group</option>
                            <option value="custom">Custom</option>
                          </Select>
                          <Input value={it.title} onChange={(e) => updateItem(si, ii, { title: e.target.value })} placeholder="Item title" />
                          <div className="ml-auto inline-flex items-center gap-1">
                            <button type="button" aria-label="Move up" className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-[color:var(--color-neutral-200)] hover:bg-[color:var(--color-neutral-50)]" onClick={() => moveItem(si, ii, -1)}><ChevronUp size={16} /></button>
                            <button type="button" aria-label="Move down" className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-[color:var(--color-neutral-200)] hover:bg-[color:var(--color-neutral-50)]" onClick={() => moveItem(si, ii, 1)}><ChevronDown size={16} /></button>
                            <button type="button" aria-label="Remove item" className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-[color:var(--color-neutral-200)] hover:bg-red-50 text-red-600" onClick={() => removeItem(si, ii)}><Trash2 size={16} /></button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[11px] text-[color:var(--color-neutral-600)] mb-1">Duration (min)</label>
                            <Input type="number" min={0} step="1" value={it.durationMinutes ?? ""} onChange={(e) => updateItem(si, ii, { durationMinutes: e.target.value === "" ? undefined : Number(e.target.value) })} />
                          </div>
                          <div>
                            <label className="inline-flex items-center gap-2 text-[11px] text-[color:var(--color-neutral-600)]">
                              <input type="checkbox" checked={!!it.isPreview} onChange={(e) => updateItem(si, ii, { isPreview: e.target.checked })} /> Preview
                            </label>
                          </div>
                        </div>
                        <Textarea value={it.description || ""} onChange={(e) => updateItem(si, ii, { description: e.target.value })} placeholder="Item description (optional)" rows={2} />

                        {it.type === "group" && (
                          <div className="rounded-md border border-[color:var(--color-neutral-200)] bg-white p-2">
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-[12px] font-medium text-[color:var(--color-neutral-700)]">Group items</div>
                              <div className="inline-flex items-center gap-2">
                                <Select defaultValue="lesson" onChange={(e) => addChild(si, ii, e.target.value as SyllabusItemType)}>
                                  <option value="lesson">Lesson</option>
                                  <option value="quiz">Quiz</option>
                                  <option value="assignment">Assignment</option>
                                  <option value="resource">Resource</option>
                                  <option value="custom">Custom</option>
                                </Select>
                                <Button type="button" size="sm" onClick={() => addChild(si, ii, "lesson")} className="inline-flex items-center gap-1"><Plus size={16} /> Add</Button>
                              </div>
                            </div>
                            <div className="mt-2 space-y-2">
                              {(it.children || []).length === 0 ? (
                                <div className="text-[12px] text-[color:var(--color-neutral-600)]">No items in this group.</div>
                              ) : (
                                (it.children || []).map((ch, ci) => (
                                  <div key={ch.id} className="rounded-md border border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-50)] p-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                      <Select value={ch.type} onChange={(e) => updateChild(si, ii, ci, { type: e.target.value as SyllabusItemType })}>
                                        <option value="lesson">Lesson</option>
                                        <option value="quiz">Quiz</option>
                                        <option value="assignment">Assignment</option>
                                        <option value="resource">Resource</option>
                                        <option value="custom">Custom</option>
                                      </Select>
                                      <Input value={ch.title} onChange={(e) => updateChild(si, ii, ci, { title: e.target.value })} placeholder="Title" />
                                      <Input type="number" min={0} step="1" value={ch.durationMinutes ?? ""} onChange={(e) => updateChild(si, ii, ci, { durationMinutes: e.target.value === "" ? undefined : Number(e.target.value) })} placeholder="Duration (min)" />
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                      <Textarea value={ch.description || ""} onChange={(e) => updateChild(si, ii, ci, { description: e.target.value })} placeholder="Description (optional)" rows={2} />
                                      <button type="button" aria-label="Remove" className="ml-auto h-8 w-8 inline-flex items-center justify-center rounded-md border border-[color:var(--color-neutral-200)] hover:bg-red-50 text-red-600" onClick={() => removeChild(si, ii, ci)}><Trash2 size={16} /></button>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


