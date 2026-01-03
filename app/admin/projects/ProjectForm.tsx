'use client';

import { useState } from "react";
import { Project } from "./page";

export default function ProjectForm({
  project,
  close,
  refresh
}: {
  project: Project | null;
  close: () => void;
  refresh: () => void;
}) {

  const [form, setForm] = useState<Project>({
    title: project?.title || "",
    description: project?.description || "",
    price: project?.price || "",
    category: project?.category || ""
  });

  const submit = async () => {
    const url = project
      ? "https://academicprojects.org/api/update_project.php"
      : "https://academicprojects.org/api/add_project.php";

    await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, id: project?.id })
    });

    refresh();
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-96">
        <h3 className="text-lg font-semibold mb-3">
          {project ? "Edit Project" : "Add Project"}
        </h3>

        <input
          placeholder="Title"
          className="border p-2 w-full mb-2"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="border p-2 w-full mb-2"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <input
          placeholder="Category"
          className="border p-2 w-full mb-2"
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
        />

        <input
          placeholder="Price"
          className="border p-2 w-full mb-2"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
        />

        <div className="flex justify-end gap-2">
          <button className="px-3 py-1" onClick={close}>Cancel</button>

          <button
            className="bg-blue-600 text-white px-3 py-1 rounded"
            onClick={submit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
