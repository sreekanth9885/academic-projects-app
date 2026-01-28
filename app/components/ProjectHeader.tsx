interface HeaderProps {
  adminEmail: string;
  onAddProject: () => void;
  onLogout: () => void;
  search: string;
  onSearch: (value: string) => void;
}

export default function ProjectHeader({
  adminEmail,
  onAddProject,
  onLogout,
  search,
  onSearch,
}: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold">Projects Management</h2>
        <p className="text-gray-600">
          Welcome back, {adminEmail || "Admin"}
        </p>
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search projects..."
          className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={onAddProject}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Add Project
        </button>

        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
