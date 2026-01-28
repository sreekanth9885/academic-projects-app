import { API_BASE } from "../constants";
import { ApiResponse } from "../lib/type";


export class ProjectService {
  static async getAllProjects(): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE}/projects.php`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    console.log("Get all projects response:", res);
    return res.json();
  }
  static async getProjects(page: number = 1, limit: number = 10): Promise<ApiResponse> {
    const res = await fetch(
      `${API_BASE}/projects.php?page=${page}&limit=${limit}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    return res.json();
  }

  static async createProject(
    formData: FormData,
    token: string
  ): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE}/projects.php`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });
    return res.json();
  }

  static async updateProject(
    formData: FormData,
    token: string
  ): Promise<ApiResponse> {
    return this.createProject(formData, token); // Same endpoint handles both
  }

  static async deleteProject(id: string, token: string): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE}/projects.php?id=${id}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    return res.json();
  }

  static async logout(token: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/auth.php?logout=true`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  static validateForm(form: {
    title: string;
    categories: string[];
    actual_price: string;
    price: string;
  }): string | null {
    if (!form.title.trim()) return "Title is required";
    if (form.categories.length === 0) return "Please select at least one category";
    if (!form.actual_price) return "Actual price is required";
    if (Number(form.actual_price) < Number(form.price)) {
      return "Actual price must be greater than or equal to price";
    }
    return null;
  }

  static createFormData(form: any, editingId?: string): FormData {
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('categories', form.categories.join(', '));
    formData.append('price', form.price);
    formData.append('actual_price', form.actual_price);
    
    if (editingId) {
      formData.append('id', editingId);
    }
    
    if (form.documentation) {
      formData.append('documentation', form.documentation);
    }
    
    if (form.code_files) {
      formData.append('code_files', form.code_files);
    }

    return formData;
  }
}