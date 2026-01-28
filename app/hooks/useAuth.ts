import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState<string>("");

  useEffect(() => {
    const email = localStorage.getItem("admin_email") || "";
    setAdminEmail(email);
    
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("admin_token");
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  };

  return { adminEmail, getAuthHeaders };
}