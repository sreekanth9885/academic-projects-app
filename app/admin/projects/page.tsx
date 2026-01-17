"use client";

import { API_BASE } from "@/app/constants";
import { act, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string; // Changed from category to categories (comma-separated string)
  price: string;
  actual_price: string;
  documentation?: string;
  code_files?: string;
  created_at?: string;
}

interface ApiResponse {
  status: "success" | "error";
  message?: string;
  data?: Project[];
  project?: Project;
  token?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Available categories/languages
const CATEGORIES = [
  "Python",
  "JavaScript",
  "Java",
  "C++",
  "C#",
  "PHP",
  "Ruby",
  "Go",
  "Swift",
  "Kotlin",
  "TypeScript",
  "React",
  "Vue.js",
  "Angular",
  "Node.js",
  "Django",
  "Flask",
  "Laravel",
  "Spring Boot",
  "ASP.NET",
  "Machine Learning",
  "Data Science",
  "Web Development",
  "Mobile Development",
  "Game Development",
  "DevOps",
  "Cybersecurity",
  "Blockchain",
  "IoT",
  "Other"
];

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({ 
    title: "", 
    description: "", 
    categories: [] as string[], // Changed to array for multiple selection
    price: "",
    actual_price: "",
    documentation: null as File | null,
    code_files: null as File | null
  });
  const [uploading, setUploading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [adminEmail, setAdminEmail] = useState<string>("");

  // Initialize after component mounts
  useEffect(() => {
    const email = localStorage.getItem("admin_email") || "";
    setAdminEmail(email);
    
    // Check if user is logged in
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  // Get authentication headers for JSON requests
  function getAuthHeaders() {
    const token = localStorage.getItem("admin_token");
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  async function loadProjects(pageNum: number = 1) {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    
    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE}/projects.php?page=${pageNum}&limit=10`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      const data: ApiResponse = await res.json();
      console.log("Load projects response:", data);
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
  setUploading(true);
    if (!form.actual_price) {
  toast.error("Actual price is required");
  setUploading(false);
  return;
}

if (Number(form.actual_price) < Number(form.price)) {
  toast.error("Actual price must be greater than or equal to price");
  setUploading(false);
  return;
}
  if (!form.title.trim()) {
    toast.error("Title is required");
    setUploading(false);
    return;
  }

  if (form.categories.length === 0) {
    toast.error("Please select at least one category");
    setUploading(false);
    return;
  }

  const token = localStorage.getItem("admin_token");
  if (!token) {
    router.push("/admin/login");
    setUploading(false);
    return;
  }

  // Create FormData for file upload
  const formData = new FormData();
  formData.append('title', form.title);
  formData.append('description', form.description);
  formData.append('categories', form.categories.join(', '));
  formData.append('price', form.price);
  formData.append('actual_price', form.actual_price);
  
  if (editing?.id) {
    formData.append('id', editing.id);
  }
  
  if (form.documentation) {
    formData.append('documentation', form.documentation);
  }
  
  if (form.code_files) {
    formData.append('code_files', form.code_files);
  }

  try {
    // Now use only projects.php for everything
    const url = `${API_BASE}/projects.php`;
    const res = await fetch(url, {
      method: "POST", // Always use POST for form data
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });

    if (res.status === 401 || res.status === 403) {
      localStorage.clear();
      toast.error("Session expired. Please login again.");
      router.push("/admin/login");
      setUploading(false);
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
      setForm({ 
        title: "", 
        description: "", 
        categories: [], 
        price: "",
        actual_price: "",
        documentation: null,
        code_files: null
      });
    } else {
      toast.error(json.message || "Operation failed");
    }

  } catch (error) {
    console.error("Save project error:", error);
    toast.error("Error saving project");
  } finally {
    setUploading(false);
  }
}

  async function deleteProject(id: string) {
  if (!confirm("Are you sure you want to delete this project?")) return;

  const token = localStorage.getItem("admin_token");
  if (!token) {
    router.push("/admin/login");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/projects.php?id=${id}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (res.status === 401 || res.status === 403) {
      localStorage.clear();
      toast.error("Session expired. Please login again.");
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

  async function logout() {
    try {
      const token = localStorage.getItem("admin_token");
      if (token) {
        await fetch(`${API_BASE}/auth.php?logout=true`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.clear();
      router.push("/");
    }
  }

  function handleEditClick(project: Project) {
    setEditing(project);
    // Split comma-separated categories back to array
    const categoriesArray = project.category 
      ? project.category.split(',').map(cat => cat.trim()).filter(cat => cat)
      : [];
    
    setForm({
      title: project.title,
      description: project.description,
      categories: categoriesArray,
      price: project.price,
      actual_price: project.actual_price,
      documentation: null,
      code_files: null
    });
    setModalOpen(true);
  }

  function resetForm() {
    setForm({ 
      title: "", 
      description: "", 
      categories: [], 
      price: "",
      actual_price: "",
      documentation: null,
      code_files: null
    });
    setEditing(null);
    setModalOpen(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, field: 'documentation' | 'code_files') {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type
      if (field === 'code_files' && !file.name.endsWith('.zip')) {
        toast.error("Please upload a ZIP file for code files");
        return;
      }
      if (field === 'documentation' && !file.name.match(/\.(pdf|doc|docx|txt|md)$/i)) {
        toast.error("Please upload a PDF, DOC, DOCX, TXT, or MD file for documentation");
        return;
      }
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should be less than 10MB");
        return;
      }
      setForm(prev => ({ ...prev, [field]: file }));
    }
  }

  function handleCategoryChange(category: string) {
    setForm(prev => {
      if (prev.categories.includes(category)) {
        // Remove category if already selected
        return {
          ...prev,
          categories: prev.categories.filter(c => c !== category)
        };
      } else {
        // Add category if not selected
        return {
          ...prev,
          categories: [...prev.categories, category]
        };
      }
    });
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
                        Categories
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Files
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
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {project.title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                            {project.description}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {project.category 
                              ? project.category.split(',').map((category, index) => (
                                  <span 
                                    key={index}
                                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
                                  >
                                    {category.trim()}
                                  </span>
                                ))
                              : <span className="text-gray-500">No categories</span>
                            }
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
  <div className="text-gray-900 font-semibold">
    ${parseFloat(project.price).toFixed(2)}
  </div>
  <div className="text-gray-500 line-through text-xs">
    ${parseFloat(project.actual_price).toFixed(2)}
  </div>
</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex flex-col gap-1">
                            {project.documentation && (
                              <a 
                                href={`${API_BASE}/uploads/${project.documentation}`}
                                target="_blank"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                📄 Documentation
                              </a>
                            )}
                            {project.code_files && (
                              <a 
                                href={`${API_BASE}/uploads/${project.code_files}`}
                                target="_blank"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                📦 Code Files
                              </a>
                            )}
                          </div>
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
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              resetForm();
            }
          }}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {editing ? "Edit Project" : "Add New Project"}
              </h3>
              <button
                type="button"
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-500 text-xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={saveProject} className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
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

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Project description"
                      rows={4}
                      value={form.description}
                      onChange={(e) => setForm({...form, description: e.target.value})}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categories *
                    </label>
                    <div className="p-3 border border-gray-300 rounded max-h-60 overflow-y-auto">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {CATEGORIES.map((category) => (
                          <div key={category} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`category-${category}`}
                              checked={form.categories.includes(category)}
                              onChange={() => handleCategoryChange(category)}
                              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label 
                              htmlFor={`category-${category}`}
                              className="ml-2 text-sm text-gray-700 cursor-pointer"
                            >
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Selected: {form.categories.length > 0 
                          ? form.categories.join(', ') 
                          : 'None'}
                      </p>
                    </div>
                  </div>
                  <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Actual Price ($) *
  </label>
  <input
    type="number"
    step="0.01"
    min="0"
    required
    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="0.00"
    value={form.actual_price}
    onChange={(e) => setForm({...form, actual_price: e.target.value})}
  />
</div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      value={form.price}
                      onChange={(e) => setForm({...form, price: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documentation
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
                      <input
                        type="file"
                        id="documentation"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt,.md"
                        onChange={(e) => handleFileChange(e, 'documentation')}
                      />
                      <label htmlFor="documentation" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                          <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-sm text-gray-600">
                            {form.documentation 
                              ? form.documentation.name 
                              : "Upload documentation (PDF, DOC, DOCX, TXT, MD)"}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">Max 10MB</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Code Files (ZIP)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
                      <input
                        type="file"
                        id="code_files"
                        className="hidden"
                        accept=".zip"
                        onChange={(e) => handleFileChange(e, 'code_files')}
                      />
                      <label htmlFor="code_files" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                          <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-sm text-gray-600">
                            {form.code_files 
                              ? form.code_files.name 
                              : "Upload code files (ZIP format)"}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">Max 10MB</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={uploading}
                >
                  {uploading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {editing ? "Updating..." : "Creating..."}
                    </span>
                  ) : (
                    editing ? "Update Project" : "Create Project"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}