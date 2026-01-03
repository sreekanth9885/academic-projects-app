'use client';

import { useEffect, useState } from "react";
import ProjectsTable from "./ProjectsTable";
import ProjectForm from "./ProjectForm";

export interface Project {
  id?: number;
  title: string;
  description: string;
  price: string;
  category: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);

  const loadProjects = async () => {
    setLoading(true);

    const res = await fetch("https://academicprojects.org/api/projects.php", {
      credentials: "include"
    });

    const data = await res.json();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold">Projects</h2>

        <button
          onClick={() => { setEditProject(null); setShowForm(true); }}
          className="bg-blue-600 text-white px-3 py-2 rounded"
        >
          + Add Project
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ProjectsTable
          projects={projects}
          onEdit={(p) => { setEditProject(p); setShowForm(true); }}
          onUpdated={loadProjects}
        />
      )}

      {showForm && (
        <ProjectForm
          project={editProject}
          close={() => setShowForm(false)}
          refresh={loadProjects}
        />
      )}
    </div>
  );
}
