"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { useProjects } from "@/app/hooks/useProjects";
import { Project, ProjectFormData } from "@/app/lib/type";
import { ProjectService } from "@/app/services/projectService";
import ProjectHeader from "@/app/components/ProjectHeader";
import ProjectTable from "@/app/components/ProjectTable";
import Pagination from "@/app/components/Pagination";
import Modal from "@/app/components/Modal";
import ProjectForm from "@/app/components/ProjectForm";
import EmptyState from "@/app/components/EmptyState";
import LoadingState from "@/app/components/LoadingState";


export default function ProjectsPage() {
  const router = useRouter();
  const { adminEmail } = useAuth();
  const { projects, loading, page, totalPages, setPage, loadProjects } = useProjects();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  const showPagination = !search.trim();
  async function loadAllProjects() {
  const token = localStorage.getItem("admin_token");
  if (!token) return;

  const data = await ProjectService.getAllProjects(); 
  console.log("Load all projects response:", data);
  if (data.status === "success") {
    setAllProjects(data.data || []);
  }
}
  useEffect(() => {
  loadAllProjects();
}, []);

  const filteredProjects = useMemo(() => {
  if (!search.trim()) return projects;

  const query = search.toLowerCase();

  return allProjects.filter((project) =>
    [
      project.title,
      project.description,
      project.category,
    ]
      .filter(Boolean)
      .some((field) =>
        field.toString().toLowerCase().includes(query)
      )
  );
}, [projects, search]);
  async function handleSaveProject(form: ProjectFormData) {
    setUploading(true);

    // Validate form
    const error = ProjectService.validateForm(form);
    if (error) {
      toast.error(error);
      setUploading(false);
      return;
    }

    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      setUploading(false);
      return;
    }

    try {
      const formData = ProjectService.createFormData(form, editing?.id);
      const data = await ProjectService.createProject(formData, token);

      if (data.status === "success") {
        toast.success(editing ? "Project updated successfully!" : "Project created successfully!");
        loadProjects(page);
        setModalOpen(false);
        setEditing(null);
      } else {
        toast.error(data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Save project error:", error);
      toast.error("Error saving project");
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteProject(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const data = await ProjectService.deleteProject(id, token);
      if (data.status === "success") {
        toast.success("Project deleted successfully!");
        loadProjects(page);
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete project error:", error);
      toast.error("Error deleting project");
    }
  }

  async function handleLogout() {
    const token = localStorage.getItem("admin_token");
    if (token) {
      await ProjectService.logout(token);
    }
    localStorage.clear();
    router.push("/");
  }

  function handleEditClick(project: Project) {
    setEditing(project);
    setModalOpen(true);
  }

  function handleModalClose() {
    setModalOpen(false);
    setEditing(null);
  }

  return (
    <div className="container mx-auto p-6">
      <ProjectHeader 
        adminEmail={adminEmail}
        onAddProject={() => setModalOpen(true)}
        onLogout={handleLogout}
        search={search}
        onSearch={setSearch}
      />

      {loading ? (
        <LoadingState />
      ) : (
        <>
          {filteredProjects.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <ProjectTable
                projects={filteredProjects}
                onEdit={handleEditClick}
                onDelete={handleDeleteProject}
                API_BASE={process.env.NEXT_PUBLIC_API_BASE || ""}
              />
              {showPagination &&(
                <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
              )}
              
            </>
          )}
        </>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        title={editing ? "Edit Project" : "Add New Project"}
      >
        <ProjectForm
          editing={editing}
          onSubmit={handleSaveProject}
          onCancel={handleModalClose}
          loading={uploading}
        />
      </Modal>
    </div>
  );
}