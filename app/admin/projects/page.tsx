"use client";

import { API_BASE } from "@/app/constants";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string;
}

export default function ProjectsPage() {

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({ title: "", description: "", category: "", price: "" });

  async function loadProjects() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/projects.php`, {
        credentials: "include"
      });

      const data = await res.json();

      setProjects(data);        // <-- FIX
    } catch {
      toast.error("Failed to load projects");
    }
    setLoading(false);
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function saveProject(e: any) {
  e.preventDefault();

  if (!form.title) return toast.error("Title required");

  const url = editing
    ? `${API_BASE}/update_project.php`
    : `${API_BASE}/add_project.php`;

  try {
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: editing?.id,
        title: form.title,
        description: form.description,
        price: form.price ?? "",
        category: form.category ?? ""
      })
    });

    const json = await res.json();

    if (json.status === "success") {
      toast.success(json.message);
      loadProjects();
      setModalOpen(false);
      setEditing(null);
      setForm({ title: "", description: "" , category: "", price: "" });
    } else toast.error(json.message);

  } catch {
    toast.error("Error saving project");
  }
}


  async function deleteProject(id: string) {

  if (!confirm("Delete project?")) return;

  try {
    const res = await fetch(`${API_BASE}/delete_project.php`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    });

    const json = await res.json();

    if (json.status === "success") {
      toast.success("Deleted");
      loadProjects();
    } else toast.error(json.message);

  } catch {
    toast.error("Error deleting");
  }
}


  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Projects</h2>

        <button
          onClick={() => { setModalOpen(true); setEditing(null); }}
          className="bg-blue-600 text-white px-4 py-2 rounded">
          + Add Project
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full bg-white shadow">
          <thead>
            <tr className="border">
              <th className="p-2">Title</th>
              <th className="p-2">Description</th>
              <th className="p-2">Category</th>
              <th className="p-2">Price</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {projects.map(p => (
              <tr key={p.id} className="border">
                <td className="p-2">{p.title}</td>
                <td className="p-2">{p.description}</td>
                <td className="p-2">{p.category}</td>
                <td className="p-2">{p.price}</td>
                <td className="p-2 text-right">
                  <button
                    onClick={() => { setEditing(p); setForm(p); setModalOpen(true); }}
                    className="px-3 py-1 bg-yellow-500 text-white mr-2 rounded">
                    Edit
                  </button>

                  <button
                    onClick={() => deleteProject(p.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <form onSubmit={saveProject}
            className="bg-white p-6 rounded shadow w-96">

            <h3 className="text-lg font-bold mb-4">
              {editing ? "Edit Project" : "Add Project"}
            </h3>

            <input
              className="border p-2 w-full mb-3"
              placeholder="Project Title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />

            <textarea
              className="border p-2 w-full mb-3"
              placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
            <input
              className="border p-2 w-full mb-3"
              placeholder="Category"
              value={form.category || ""}
              onChange={e => setForm({ ...form, category: e.target.value })}
            />
            <input
              className="border p-2 w-full mb-5"
              placeholder="Price"
              value={form.price || ""}
              onChange={e => setForm({ ...form, price: e.target.value })}
            />

            <div className="flex justify-end gap-3">
              <button type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border rounded">
                Cancel
              </button>

              <button className="px-4 py-2 bg-blue-600 text-white rounded">
                Save
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
