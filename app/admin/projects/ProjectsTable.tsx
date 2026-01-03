'use client';

import { Project } from "./page";

export default function ProjectsTable({
  projects,
  onEdit,
  onUpdated
}: {
  projects: Project[];
  onEdit: (p: Project) => void;
  onUpdated: () => void;
}) {

  const deleteProject = async (id?: number) => {
    if (!id) return;
    if (!confirm("Delete this project?")) return;

    await fetch("https://academicprojects.org/api/delete_project.php", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });

    onUpdated();
  };

  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">Title</th>
          <th className="p-2 border">Category</th>
          <th className="p-2 border">Price</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>

      <tbody>
        {projects.map(p => (
          <tr key={p.id}>
            <td className="p-2 border">{p.title}</td>
            <td className="p-2 border">{p.category}</td>
            <td className="p-2 border">₹{p.price}</td>

            <td className="p-2 border space-x-2">
              <button
                className="bg-yellow-500 text-white px-2 py-1 rounded"
                onClick={() => onEdit(p)}
              >
                Edit
              </button>

              <button
                className="bg-red-600 text-white px-2 py-1 rounded"
                onClick={() => deleteProject(p.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
