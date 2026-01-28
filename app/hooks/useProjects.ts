import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Project } from "../lib/type";
import { ProjectService } from "../services/projectService";


export function useProjects() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadProjects = useCallback(async (pageNum: number = 1) => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    
    setLoading(true);

    try {
      const data = await ProjectService.getProjects(pageNum);
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
  }, [router]);

  useEffect(() => {
    loadProjects(page);
  }, [page, loadProjects]);

  return {
    projects,
    loading,
    page,
    totalPages,
    setPage,
    loadProjects
  };
}