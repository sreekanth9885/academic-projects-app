import { useState } from "react";
import { Project } from "../lib/type";

const CATEGORIES = [
  "Python", "JavaScript", "Java", "C++", "C#", "PHP", "Ruby", "Go", "Swift",
  "Kotlin", "TypeScript", "React", "Vue.js", "Angular", "Node.js", "Django",
  "Flask", "Laravel", "Spring Boot", "ASP.NET", "Machine Learning", "Data Science",
  "Web Development", "Mobile Development", "Game Development", "DevOps",
  "Cybersecurity", "Blockchain", "IoT", "Other"
];

interface ProjectFormProps {
  editing: Project | null;
  onSubmit: (form: ProjectFormData) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
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

export default function ProjectForm({ 
  editing, 
  onSubmit, 
  onCancel,
  loading 
}: ProjectFormProps) {
  const [form, setForm] = useState<ProjectFormData>({
    title: editing?.title || "",
    description: editing?.description || "",
    categories: editing?.category 
      ? editing.category.split(',').map(cat => cat.trim()).filter(cat => cat)
      : [],
    price: editing?.price || "",
    actual_price: editing?.actual_price || "",
    documentation: null,
    code_files: null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  const handleCategoryChange = (category: string) => {
    setForm(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'documentation' | 'code_files') => {
    if (e.target.files?.[0]) {
      setForm(prev => ({ ...prev, [field]: e.target.files![0] }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormFields 
            form={form}
            setForm={setForm}
            handleCategoryChange={handleCategoryChange}
            handleFileChange={handleFileChange}
          />
        </div>
      </div>

      <FormActions 
        onCancel={onCancel}
        loading={loading}
        isEditing={!!editing}
      />
    </form>
  );
}

interface FormFieldsProps {
  form: ProjectFormData;
  setForm: React.Dispatch<React.SetStateAction<ProjectFormData>>;
  handleCategoryChange: (category: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, field: 'documentation' | 'code_files') => void;
}

function FormFields({ 
  form, 
  setForm, 
  handleCategoryChange, 
  handleFileChange 
}: FormFieldsProps) {
  return (
    <>
      <div className="md:col-span-2">
        <FormInput
          label="Title *"
          type="text"
          value={form.title}
          onChange={(e) => setForm({...form, title: e.target.value})}
          placeholder="Project title"
          required
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
        <CategorySelector 
          categories={form.categories}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      <div>
        <FormInput
          label="Actual Price ($) *"
          type="number"
          step="0.01"
          min="0"
          value={form.actual_price}
          onChange={(e) => setForm({...form, actual_price: e.target.value})}
          placeholder="0.00"
          required
        />
      </div>

      <div>
        <FormInput
          label="Price ($) *"
          type="number"
          step="0.01"
          min="0"
          value={form.price}
          onChange={(e) => setForm({...form, price: e.target.value})}
          placeholder="0.00"
          required
        />
      </div>

      <div>
        <FileUpload
          label="Documentation"
          id="documentation"
          accept=".pdf,.doc,.docx,.txt,.md"
          file={form.documentation}
          onChange={(e) => handleFileChange(e, 'documentation')}
          description="Upload documentation (PDF, DOC, DOCX, TXT, MD)"
        />
      </div>

      <div>
        <FileUpload
          label="Code Files (ZIP)"
          id="code_files"
          accept=".zip"
          file={form.code_files}
          onChange={(e) => handleFileChange(e, 'code_files')}
          description="Upload code files (ZIP format)"
        />
      </div>
    </>
  );
}

function FormInput({
  label,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        {...props}
      />
    </div>
  );
}

function CategorySelector({ 
  categories, 
  onCategoryChange 
}: { 
  categories: string[];
  onCategoryChange: (category: string) => void;
}) {
  return (
    <div>
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
                checked={categories.includes(category)}
                onChange={() => onCategoryChange(category)}
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
          Selected: {categories.length > 0 
            ? categories.join(', ') 
            : 'None'}
        </p>
      </div>
    </div>
  );
}

function FileUpload({
  label,
  id,
  accept,
  file,
  onChange,
  description
}: {
  label: string;
  id: string;
  accept: string;
  file: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
        <input
          type="file"
          id={id}
          className="hidden"
          accept={accept}
          onChange={onChange}
        />
        <label htmlFor={id} className="cursor-pointer">
          <div className="flex flex-col items-center">
            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-sm text-gray-600">
              {file ? file.name : description}
            </span>
            <span className="text-xs text-gray-500 mt-1">Max 10MB</span>
          </div>
        </label>
      </div>
    </div>
  );
}

function FormActions({ 
  onCancel, 
  loading, 
  isEditing 
}: { 
  onCancel: () => void;
  loading: boolean;
  isEditing: boolean;
}) {
  return (
    <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
      <button
        type="button"
        onClick={onCancel}
        className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition cursor-pointer"
        disabled={loading}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {isEditing ? "Updating..." : "Creating..."}
          </span>
        ) : (
          isEditing ? "Update Project" : "Create Project"
        )}
      </button>
    </div>
  );
}