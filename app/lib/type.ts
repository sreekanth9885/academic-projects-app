export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string;
  actual_price: string;
  documentation?: string;
  code_files?: string;
  created_at?: string;
}

export interface ApiResponse {
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

export interface ProjectFormData {
  title: string;
  description: string;
  categories: string[];
  price: string;
  actual_price: string;
  documentation: File | null;
  code_files: File | null;
}