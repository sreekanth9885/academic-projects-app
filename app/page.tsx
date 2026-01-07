"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_BASE } from "./constants";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await res.json();
      console.log("Login response:", data);
      
      if (data.status !== "success") {
        alert(data.message || "Invalid credentials");
        return;
      }

      // Store token and admin data
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_id", data.admin.id);
      localStorage.setItem("admin_email", data.admin.email);

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <form onSubmit={login} className="bg-white shadow p-6 rounded w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            required
            type="email"
            className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            placeholder="admin@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            required
            type="password"
            className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}