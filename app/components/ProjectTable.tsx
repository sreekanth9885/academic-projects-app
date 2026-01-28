import { IndianRupee } from "lucide-react";
import { Project } from "../lib/type";

interface ProjectTableProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  API_BASE: string;
}

export default function ProjectTable({ 
  projects, 
  onEdit, 
  onDelete,
  API_BASE 
}: ProjectTableProps) {
  return (
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
              <ProjectTableRow
                key={project.id}
                project={project}
                onEdit={onEdit}
                onDelete={onDelete}
                API_BASE={API_BASE}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProjectTableRow({ 
  project, 
  onEdit, 
  onDelete,
  API_BASE 
}: { 
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  API_BASE: string;
}) {
  return (
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
        <PriceDisplay 
          price={project.price} 
          actualPrice={project.actual_price} 
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <FileLinks 
          documentation={project.documentation}
          codeFiles={project.code_files}
          API_BASE={API_BASE}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {project.created_at ? 
          new Date(project.created_at).toLocaleDateString() : 
          "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <ActionButtons 
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
}

function PriceDisplay({ price, actualPrice }: { price: string; actualPrice: string }) {
  return (
    <div>
      <div className="text-gray-900 font-semibold">
        <div className="flex items-center">
          <IndianRupee className="w-3 h-3" />{parseFloat(price).toFixed(2)}
        </div>
      </div>
      <div className="text-gray-500 line-through text-xs">
        <div className="flex items-center">
          <IndianRupee className="w-3 h-3" /> {parseFloat(actualPrice).toFixed(2)}
        </div>
      </div>
    </div>
  );
}

function FileLinks({ 
  documentation, 
  codeFiles,
  API_BASE 
}: { 
  documentation?: string; 
  codeFiles?: string;
  API_BASE: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      {documentation && (
        <a 
          href={`${API_BASE}/uploads/${documentation}`}
          target="_blank"
          className="text-blue-600 hover:text-blue-800"
        >
          📄 Documentation
        </a>
      )}
      {codeFiles && (
        <a 
          href={`${API_BASE}/uploads/${codeFiles}`}
          target="_blank"
          className="text-blue-600 hover:text-blue-800"
        >
          📦 Code Files
        </a>
      )}
    </div>
  );
}

function ActionButtons({ 
  project, 
  onEdit, 
  onDelete 
}: { 
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onEdit(project)}
        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded transition cursor-pointer"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(project.id)}
        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition cursor-pointer"
      >
        Delete
      </button>
    </div>
  );
}