"use client";

import { API_BASE } from "@/app/constants";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string;
  created_at?: string;
}

interface ApiResponse {
  status: "success" | "error";
  message?: string;
  data?: Project[];
  project?: Project;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({ 
    title: "", 
    description: "", 
    category: "", 
    price: "" 
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [adminEmail, setAdminEmail] = useState<string>("");

  // Initialize admin email after component mounts (client-side only)
  useEffect(() => {
    const email = localStorage.getItem("admin_email") || "";
    setAdminEmail(email);
    
    // Check if user is logged in
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  // Fix CORS issue by removing credentials for cross-origin requests
  // Or add proxy in Next.js
  function checkAuth(): boolean {
    if (typeof window === 'undefined') return false;
    
    const adminToken = localStorage.getItem("admin_token");
    return !!adminToken;
  }

  async function loadProjects(pageNum: number = 1) {
    if (!checkAuth()) return;
    
    setLoading(true);

    try {
      // Remove credentials: 'include' for CORS issues
      const res = await fetch(
        `${API_BASE}/projects.php?page=${pageNum}&limit=10`,
        {
          // credentials: 'include' // Remove this for CORS
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        }
      );

      if (res.status === 401 || res.status === 403) {
        localStorage.clear();
        router.push("/admin/login");
        return;
      }

      const data: ApiResponse = await res.json();
      
      if (data.status === "success" && data.data) {
        setProjects(data.data);
        if (data.pagination) {
          setTotalPages(data.pagination.pages);
        }
      } else {
        toast.error(data.message || "Failed to load projects");
      }

    } catch (error) {
      console.error("Load projects error:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects(page);
  }, [page]);

  async function saveProject(e: React.FormEvent) {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!checkAuth()) {
      router.push("/admin/login");
      return;
    }

    const url = `${API_BASE}/projects.php`;
    const method = editing ? "PUT" : "POST";
    
    const bodyData = editing 
      ? { 
          id: editing.id,
          title: form.title,
          description: form.description,
          price: parseFloat(form.price) || 0,
          category: form.category 
        }
      : {
          title: form.title,
          description: form.description,
          price: parseFloat(form.price) || 0,
          category: form.category
        };

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        // Remove credentials for CORS
        // credentials: 'include',
        body: JSON.stringify(bodyData)
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.clear();
        router.push("/admin/login");
        return;
      }

      const json: ApiResponse = await res.json();

      if (json.status === "success") {
        toast.success(
          editing ? "Project updated successfully!" : "Project created successfully!"
        );
        loadProjects(page);
        setModalOpen(false);
        setEditing(null);
        setForm({ title: "", description: "", category: "", price: "" });
      } else {
        toast.error(json.message || "Operation failed");
      }

    } catch (error) {
      console.error("Save project error:", error);
      toast.error("Error saving project");
    }
  }

  async function deleteProject(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;

    if (!checkAuth()) {
      router.push("/admin/login");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/projects.php?id=${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json"
        }
        // Remove credentials for CORS
        // credentials: 'include'
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.clear();
        router.push("/admin/login");
        return;
      }

      const json: ApiResponse = await res.json();

      if (json.status === "success") {
        toast.success("Project deleted successfully!");
        loadProjects(page);
      } else {
        toast.error(json.message || "Delete failed");
      }

    } catch (error) {
      console.error("Delete project error:", error);
      toast.error("Error deleting project");
    }
  }

  function logout() {
    // Call logout API endpoint
    fetch(`${API_BASE}/auth.php?logout=true`, {
      headers: {
        "Accept": "application/json"
      }
    }).finally(() => {
      localStorage.clear();
      document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      router.push("/admin/login");
    });
  }

  function handleEditClick(project: Project) {
    setEditing(project);
    setForm({
      title: project.title,
      description: project.description,
      category: project.category || "",
      price: project.price
    });
    setModalOpen(true);
  }

  function resetForm() {
    setForm({ title: "", description: "", category: "", price: "" });
    setEditing(null);
    setModalOpen(false);
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Projects Management</h2>
          <p className="text-gray-600">
            Welcome back, {adminEmail || "Admin"}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            + Add Project
          </button>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading projects...</p>
        </div>
      ) : (
        <>
          {/* Projects Table */}
          {projects.length === 0 ? (
            <div className="text-center py-10 border rounded bg-gray-50">
              <p className="text-gray-500">No projects found. Create your first project!</p>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projects.map((project) => (
                      <tr key={project.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {project.title}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 line-clamp-2 max-w-xs">
                            {project.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {project.category || "Uncategorized"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${parseFloat(project.price).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.created_at ? 
                            new Date(project.created_at).toLocaleDateString() : 
                            "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditClick(project)}
                              className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteProject(project.id)}
                              className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 bg-gray-50 border-t">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-700">
                      Page <span className="font-medium">{page}</span> of{" "}
                      <span className="font-medium">{totalPages}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {editing ? "Edit Project" : "Add New Project"}
              </h3>
            </div>
            
            <form onSubmit={saveProject} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Project title"
                    value={form.title}
                    onChange={(e) => setForm({...form, title: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Project description"
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Web Development"
                      value={form.category}
                      onChange={(e) => setForm({...form, category: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      value={form.price}
                      onChange={(e) => setForm({...form, price: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition"
                >
                  {editing ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}